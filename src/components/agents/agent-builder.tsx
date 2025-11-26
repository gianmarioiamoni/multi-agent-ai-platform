/**
 * Agent Builder Component
 * Main form for creating/editing agents
 * Following SRP: Only handles form composition
 */

'use client';

import { FormProvider } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useAgentForm } from '@/hooks/agents/use-agent-form';
import { BasicInfoSection } from './agent-builder/basic-info-section';
import { ModelConfigSection } from './agent-builder/model-config-section';
import { ToolsSection } from './agent-builder/tools-section';
import { FormActions } from './agent-builder/form-actions';

export const AgentBuilder = () => {
  const { form, isLoading, handleSubmit } = useAgentForm();

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Give your agent a name and description
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BasicInfoSection />
          </CardContent>
        </Card>

        {/* Model Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Model Configuration</CardTitle>
            <CardDescription>
              Configure the AI model and parameters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ModelConfigSection />
          </CardContent>
        </Card>

        {/* Tools */}
        <Card>
          <CardHeader>
            <CardTitle>Tools</CardTitle>
            <CardDescription>
              Select which tools this agent can use
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ToolsSection />
          </CardContent>
        </Card>

        {/* Actions */}
        <FormActions isLoading={isLoading} />
      </form>
    </FormProvider>
  );
};

