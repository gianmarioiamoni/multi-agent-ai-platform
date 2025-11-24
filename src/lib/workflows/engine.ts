/**
 * Workflow Engine
 * Executes multi-agent workflows sequentially
 * Following SRP: Only handles workflow execution logic
 */

import { orchestrateAgent } from '@/lib/ai/orchestrator';
import { getAgent } from '@/lib/agents/actions';
import { createWorkflowRun, updateWorkflowRun, createAgentRun, updateAgentRun, createToolInvocation } from './execution-log';
import type { Workflow, WorkflowStep } from '@/types/workflow.types';
import type { Agent } from '@/types/agent.types';
import type { AgentExecutionResult } from '@/types/orchestrator.types';
import type { WorkflowExecutionResult } from '@/types/workflow-execution.types';

/**
 * Execute workflow sequentially
 * MVP: Simple sequential execution (no parallel steps)
 */
export async function executeWorkflow(
  workflow: Workflow,
  input: string,
  userId: string,
  getAgentFn?: (agentId: string) => Promise<{ data: Agent | null; error: string | null }>
): Promise<WorkflowExecutionResult> {
  const startTime = Date.now();

  // Validate workflow
  if (!workflow.graph || !workflow.graph.steps || workflow.graph.steps.length === 0) {
    throw new Error('Workflow has no steps defined');
  }

  // Validate workflow status
  if (workflow.status !== 'active') {
    throw new Error(`Workflow is not active (status: ${workflow.status})`);
  }

  // Get ordered steps (for MVP, we use steps in order)
  const orderedSteps = getOrderedSteps(workflow.graph.steps, workflow.graph.edges);

  console.log('[Workflow Engine] Starting workflow execution:', {
    workflowId: workflow.id,
    workflowName: workflow.name,
    stepCount: orderedSteps.length,
    userId,
  });

  // Create workflow run
  const workflowRunId = await createWorkflowRun({
    workflowId: workflow.id,
    input,
    userId,
  });

  // Update workflow run to running
  await updateWorkflowRun(workflowRunId, {
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

      console.log(`[Workflow Engine] Executing step ${stepOrder}/${orderedSteps.length}:`, {
        stepId: step.id,
        agentId: step.agentId,
        stepName: step.name,
      });

      // Get agent (use custom function if provided, otherwise use default)
      const getAgentFunction = getAgentFn || getAgent;
      const agentResult = await getAgentFunction(step.agentId);
      if (agentResult.error || !agentResult.data) {
        throw new Error(`Agent not found: ${step.agentId} - ${agentResult.error || 'Unknown error'}`);
      }
      const agent = agentResult.data;

      // Create agent run
      const agentRunId = await createAgentRun({
        workflowRunId,
        agentId: step.agentId,
        stepOrder,
        input: currentInput,
      });

      // Update agent run to running
      await updateAgentRun(agentRunId, {
        status: 'running',
        started_at: new Date().toISOString(),
      });

      try {
        // Execute agent
        const agentResult = await orchestrateAgent(agent, currentInput, []);

        // Process tool invocations (log them)
        for (const toolExecution of agentResult.toolCalls) {
          await createToolInvocation({
            agentRunId,
            tool: toolExecution.call.toolId,
            params: toolExecution.call.params,
            status: toolExecution.result.success ? 'completed' : 'failed',
            result: toolExecution.result.success ? toolExecution.result.data : null,
            error: toolExecution.result.success ? null : toolExecution.result.error || null,
            started_at: new Date(Date.now() - toolExecution.executionTime).toISOString(),
            finished_at: new Date().toISOString(),
            execution_time_ms: toolExecution.executionTime,
          });
        }

        // Update agent run with result
        await updateAgentRun(agentRunId, {
          status: agentResult.success ? 'completed' : 'failed',
          output: agentResult.success ? agentResult.message : null,
          error: agentResult.success ? null : agentResult.error || 'Agent execution failed',
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
          workflowError = `Step ${stepOrder} (${step.name}) failed: ${agentResult.error || 'Unknown error'}`;
          break;
        }

        // Update input for next step
        currentInput = agentResult.message;
        workflowOutput = agentResult.message;

        console.log(`[Workflow Engine] Step ${stepOrder} completed:`, {
          stepId: step.id,
          outputLength: agentResult.message.length,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        // Update agent run with error
        await updateAgentRun(agentRunId, {
          status: 'failed',
          error: errorMessage,
          finished_at: new Date().toISOString(),
        });

        agentRuns.push({
          id: agentRunId,
          agentId: step.agentId,
          stepOrder,
          status: 'failed',
          error: errorMessage,
        });

        workflowError = `Step ${stepOrder} (${step.name}) failed: ${errorMessage}`;
        break;
      }
    }

    // Update workflow run with final status
    const workflowStatus = workflowError ? 'failed' : 'completed';
    await updateWorkflowRun(workflowRunId, {
      status: workflowStatus,
      output: workflowOutput || null,
      error: workflowError || null,
      finished_at: new Date().toISOString(),
    });

    const totalExecutionTime = Date.now() - startTime;

    console.log('[Workflow Engine] Workflow execution completed:', {
      workflowId: workflow.id,
      workflowRunId,
      status: workflowStatus,
      totalExecutionTime,
      agentRunsCount: agentRuns.length,
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Update workflow run with error
    await updateWorkflowRun(workflowRunId, {
      status: 'failed',
      error: errorMessage,
      finished_at: new Date().toISOString(),
    });

    console.error('[Workflow Engine] Workflow execution failed:', {
      workflowId: workflow.id,
      workflowRunId,
      error: errorMessage,
    });

    return {
      success: false,
      workflowRunId,
      error: errorMessage,
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
  edges: Array<{ from: string; to: string }>
): WorkflowStep[] {
  // For MVP, return steps in order
  // If edges are defined, we could validate the graph structure
  // For now, just return steps as-is (assuming they're already in order)
  return steps;
}

