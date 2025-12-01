/**
 * Workflow Engine
 * Executes multi-agent workflows sequentially
 * Following SRP: Only handles workflow execution logic
 */

import { orchestrateAgent } from '@/lib/ai/orchestrator';
import { getAgent } from '@/lib/agents/actions';
import { createWorkflowRun, updateWorkflowRun, createAgentRun, updateAgentRun, createToolInvocation } from './execution-log';
import type { WorkflowExecutionLoggers } from './engine-utils';
import type { Workflow, WorkflowStep } from '@/types/workflow.types';
import type { Agent } from '@/types/agent.types';
import type { WorkflowExecutionResult } from '@/types/workflow-execution.types';
import { logInfo } from '@/lib/logging/logger';
import { createScopedLogger } from '@/lib/logging/scoped-logger';
import { handleError, createUserFriendlyError } from '@/lib/errors/error-handler';

/**
 * Execute workflow sequentially
 * MVP: Simple sequential execution (no parallel steps)
 */
export async function executeWorkflow(
  workflow: Workflow,
  input: string,
  userId: string,
  getAgentFn?: (agentId: string) => Promise<{ data: Agent | null; error: string | null }>,
  loggers?: WorkflowExecutionLoggers
): Promise<WorkflowExecutionResult> {
  const startTime = Date.now();
  const requestId = `workflow-exec-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  const logger = createScopedLogger({
    category: 'workflow.engine',
    workflowId: workflow.id,
    userId,
    requestId,
  });

  // Validate workflow
  if (!workflow.graph || !workflow.graph.steps || workflow.graph.steps.length === 0) {
    const error = new Error('Workflow has no steps defined');
    await logger.error('Workflow validation failed: no steps', error);
    throw error;
  }

  // Validate workflow status
  if (workflow.status !== 'active') {
    const error = new Error(`Workflow is not active (status: ${workflow.status})`);
    await logger.warn('Attempt to execute inactive workflow', { status: workflow.status });
    throw error;
  }

  // Get ordered steps (for MVP, we use steps in order)
  const orderedSteps = getOrderedSteps(workflow.graph.steps, workflow.graph.edges);

  await logInfo('workflow.engine', 'Starting workflow execution', {
    workflowId: workflow.id,
    workflowName: workflow.name,
    stepCount: orderedSteps.length,
    userId,
    requestId,
  });

  // Use provided loggers or default ones
  const workflowLoggers = loggers || {
    createWorkflowRun,
    updateWorkflowRun,
    createAgentRun,
    updateAgentRun,
    createToolInvocation,
  };

  // Create workflow run
  const workflowRunId = await workflowLoggers.createWorkflowRun({
    workflowId: workflow.id,
    input,
    userId,
  });

  // Update workflow run to running
  await workflowLoggers.updateWorkflowRun(workflowRunId, {
    status: 'running',
    started_at: new Date().toISOString(),
  });

  const agentRuns: WorkflowExecutionResult['agentRuns'] = [];
  let currentInput = input;
  let workflowOutput: string | undefined;
  let workflowError: string | undefined;

  try {
    // Execute steps sequentially
    for (let stepIndex = 0; stepIndex < orderedSteps.length; stepIndex++) {
      const step = orderedSteps[stepIndex];
      const stepOrder = stepIndex + 1;

      await logger.info(`Executing step ${stepOrder}/${orderedSteps.length}`, {
        stepId: step.id,
        agentId: step.agentId,
        stepName: step.name,
        workflowRunId,
      });

      // Get agent (use custom function if provided, otherwise use default)
      const getAgentFunction = getAgentFn || getAgent;
      const agentResult = await getAgentFunction(step.agentId);
      if (agentResult.error || !agentResult.data) {
        const error = new Error(`Agent not found: ${step.agentId} - ${agentResult.error || 'Unknown error'}`);
        await logger.error(`Step ${stepOrder}: Agent not found`, error, {
          stepOrder,
          agentId: step.agentId,
          workflowRunId,
        });
        throw error;
      }
      const agent = agentResult.data;

      // Create agent run
      const agentRunId = await workflowLoggers.createAgentRun({
        workflowRunId,
        agentId: step.agentId,
        stepOrder,
        input: currentInput,
      });

      // Update agent run to running
      await workflowLoggers.updateAgentRun(agentRunId, {
        status: 'running',
        started_at: new Date().toISOString(),
      });

      try {
        // Execute agent
        const agentResult = await orchestrateAgent(agent, currentInput, []);

        // Process tool invocations (log them)
        for (const toolExecution of agentResult.toolCalls) {
          await workflowLoggers.createToolInvocation({
            agentRunId,
            tool: toolExecution.call.toolId,
            params: toolExecution.call.params,
            status: toolExecution.result.success ? 'completed' : 'failed',
            result: toolExecution.result.success ? (toolExecution.result.data as Record<string, unknown> | null) : null,
            error: toolExecution.result.success ? null : toolExecution.result.error || null,
            started_at: new Date(Date.now() - toolExecution.executionTime).toISOString(),
            finished_at: new Date().toISOString(),
            execution_time_ms: toolExecution.executionTime,
          });
        }

        // Update agent run with result
        const agentError = agentResult.success
          ? null
          : createUserFriendlyError(
              new Error(agentResult.error || 'Agent execution failed'),
              'agent_execution',
              { agentId: step.agentId, stepOrder }
            ).userMessage;
            
        await workflowLoggers.updateAgentRun(agentRunId, {
          status: agentResult.success ? 'completed' : 'failed',
          output: agentResult.success ? agentResult.message : null,
          error: agentError,
          finished_at: new Date().toISOString(),
        });

        // Track agent run
        agentRuns.push({
          id: agentRunId,
          agentId: step.agentId,
          stepOrder,
          status: agentResult.success ? 'completed' : 'failed',
          output: agentResult.success ? agentResult.message : undefined,
          error: agentResult.success ? undefined : agentResult.error,
        });

        if (!agentResult.success) {
          // Workflow fails if any step fails
          const errorMsg = agentResult.error || 'Unknown error';
          workflowError = `Step ${stepOrder} (${step.name}) failed: ${errorMsg}`;
          await logger.error(`Step ${stepOrder} failed: ${step.name}`, new Error(errorMsg), {
            stepOrder,
            stepName: step.name,
            agentId: step.agentId,
            workflowRunId,
            agentRunId,
          });
          break;
        }

        // Update input for next step
        currentInput = agentResult.message;
        workflowOutput = agentResult.message;

        await logger.info(`Step ${stepOrder} completed: ${step.name}`, {
          stepId: step.id,
          outputLength: agentResult.message.length,
          workflowRunId,
          agentRunId,
        });
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        const friendlyError = createUserFriendlyError(errorObj, 'agent_execution', {
          stepOrder,
          stepName: step.name,
          agentId: step.agentId,
          workflowRunId,
        });
        
        await logger.error(`Step ${stepOrder} execution failed: ${step.name}`, errorObj, {
          stepOrder,
          stepName: step.name,
          agentId: step.agentId,
          workflowRunId,
          agentRunId,
        });
        
        // Update agent run with error
        await workflowLoggers.updateAgentRun(agentRunId, {
          status: 'failed',
          error: friendlyError.userMessage,
          finished_at: new Date().toISOString(),
        });

        agentRuns.push({
          id: agentRunId,
          agentId: step.agentId,
          stepOrder,
          status: 'failed',
          error: friendlyError.userMessage,
        });

        workflowError = `Step ${stepOrder} (${step.name}) failed: ${friendlyError.userMessage}`;
        break;
      }
    }

    // Update workflow run with final status
    const workflowStatus = workflowError ? 'failed' : 'completed';
    const totalExecutionTime = Date.now() - startTime;
    
    await workflowLoggers.updateWorkflowRun(workflowRunId, {
      status: workflowStatus,
      output: workflowOutput || null,
      error: workflowError || null,
      finished_at: new Date().toISOString(),
    });
    await logger.info('Workflow execution completed', {
      workflowId: workflow.id,
      workflowRunId,
      status: workflowStatus,
      totalExecutionTime,
      agentRunsCount: agentRuns.length,
      durationMs: totalExecutionTime,
    });

    return {
      success: !workflowError,
      workflowRunId,
      output: workflowOutput,
      error: workflowError,
      agentRuns,
      totalExecutionTime,
    };
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    const friendlyError = await handleError(errorObj, 'workflow_execution', {
      workflowId: workflow.id,
      workflowRunId,
      durationMs: Date.now() - startTime,
      requestId,
    });
    
    // Update workflow run with error
    await workflowLoggers.updateWorkflowRun(workflowRunId, {
      status: 'failed',
      error: friendlyError,
      finished_at: new Date().toISOString(),
    });

    return {
      success: false,
      workflowRunId,
      error: friendlyError,
      agentRuns,
      totalExecutionTime: Date.now() - startTime,
    };
  }
}

/**
 * Get ordered steps for execution
 * MVP: Simple sequential order (first step → last step)
 * Future: Could use edges to build proper DAG traversal
 */
function getOrderedSteps(
  steps: WorkflowStep[],
  _edges: Array<{ from: string; to: string }>
): WorkflowStep[] {
  // For MVP, return steps in order
  // If edges are defined, we could validate the graph structure
  // For now, just return steps as-is (assuming they're already in order)
  return steps;
}

