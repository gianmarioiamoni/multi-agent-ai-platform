/**
 * Help Center Constants
 * Static content for help center pages
 * Following SRP: Only data constants, no logic
 */

import type { FAQItem, HelpResource, QuickInfoItem } from '@/types/help.types';

export const quickInfoItems: QuickInfoItem[] = [
  {
    title: 'Getting Started',
    description: 'Create your first agent and workflow in minutes. Start with simple tasks and gradually build more complex automations.',
    icon: 'rocket',
  },
  {
    title: 'Best Practices',
    description: 'Learn how to design effective agents and workflows. Follow our guidelines for optimal performance and reliability.',
    icon: 'lightbulb',
  },
  {
    title: 'Security & Privacy',
    description: 'Your data is encrypted and secure. We follow industry best practices to protect your information and integrations.',
    icon: 'shield',
  },
  {
    title: 'Performance Tips',
    description: 'Optimize your workflows for faster execution. Use parallel processing and efficient tool configurations.',
    icon: 'zap',
  },
];

export const faqItems: FAQItem[] = [
  {
    question: 'What is an AI Agent?',
    answer: 'An AI Agent is an intelligent assistant that can perform specific tasks using various tools like web search, email, calendar, and database operations. Each agent has a defined role and can work independently or collaborate with other agents in a workflow.',
    category: 'general',
  },
  {
    question: 'How do I create my first agent?',
    answer: 'Go to the Agents page and click "Create Agent". Give your agent a name, description, and select which tools it should have access to. You can then test the agent immediately or use it in a workflow.',
    category: 'agents',
  },
  {
    question: 'What is a Workflow?',
    answer: 'A Workflow is a sequence of agents that work together to complete a complex task. Each agent in the workflow receives input from the previous agent and passes its output to the next one. Workflows allow you to automate multi-step business processes.',
    category: 'workflows',
  },
  {
    question: 'How do I connect Google Calendar?',
    answer: 'Navigate to the Integrations page and click "Connect" next to Google Calendar. You\'ll be redirected to Google to authorize the connection. Once connected, agents can create and read calendar events on your behalf.',
    category: 'integrations',
  },
  {
    question: 'Can I use multiple tools in one agent?',
    answer: 'Yes! When creating an agent, you can enable multiple tools. The agent will intelligently choose which tools to use based on the task at hand. For example, an agent can search the web, then send an email with the results.',
    category: 'agents',
  },
  {
    question: 'How do I view workflow execution results?',
    answer: 'Go to the Runs page to see all workflow executions. Click on any run to see detailed information including each agent\'s input/output, tool calls, and execution timeline. This helps you understand how your workflow performed.',
    category: 'workflows',
  },
  {
    question: 'What happens if a workflow fails?',
    answer: 'If a workflow fails, you can see the error details in the Runs page. The system will show which agent or tool caused the failure, along with error messages. You can then fix the issue and re-run the workflow.',
    category: 'troubleshooting',
  },
  {
    question: 'Can I schedule workflows?',
    answer: 'Currently, workflows run on-demand when you trigger them. Scheduled workflows and recurring automation will be available in a future update.',
    category: 'workflows',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we use industry-standard encryption and security practices. Your credentials are encrypted at rest, and all API communications use HTTPS. We also follow GDPR compliance guidelines.',
    category: 'general',
  },
  {
    question: 'How do I get support?',
    answer: 'You can contact our support team through the Contact page, or refer to the User Manual for detailed documentation. For urgent issues, please use the contact form and select "Technical Support" as the category.',
    category: 'general',
  },
];

export const helpResources: HelpResource[] = [
  {
    title: 'User Manual',
    description: 'Comprehensive guide covering all platform features, best practices, and advanced topics. Learn how to create agents, build workflows, and integrate with external services.',
    href: '/docs/user-guide/USER_MANUAL.md',
    icon: 'book',
    external: true,
  },
  {
    title: 'Contact Support',
    description: 'Get help from our team. Submit questions, report bugs, or request new features. We typically respond within 2 business days.',
    href: '/app/contact',
    icon: 'mail',
    external: false,
  },
];

