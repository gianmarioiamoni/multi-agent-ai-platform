# Multi-Agent AI Platform - User Manual

**Version**: 1.0  
**Last Updated**: December 2024

---

## 📖 Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Dashboard Overview](#dashboard-overview)
4. [Managing Agents](#managing-agents)
5. [Creating and Managing Workflows](#creating-and-managing-workflows)
6. [Running Workflows](#running-workflows)
7. [Viewing Execution Results](#viewing-execution-results)
8. [Integrations](#integrations)
9. [Account Settings](#account-settings)
10. [Tips & Best Practices](#tips--best-practices)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 Introduction

Welcome to the **Multi-Agent AI Platform**! This platform allows you to create, manage, and orchestrate AI agents to automate complex business workflows. Agents can collaborate using various tools like web search, email, calendar, and database operations to complete tasks efficiently.

### What is an Agent?

An **Agent** is an AI-powered assistant with a specific role or expertise. Each agent can:
- Understand natural language instructions
- Use specialized tools (web search, email, calendar, etc.)
- Make decisions based on context
- Work independently or collaborate with other agents

### What is a Workflow?

A **Workflow** is a sequence of agents that work together to complete a complex task. Each workflow:
- Defines the order of agent execution
- Passes data from one agent to the next
- Tracks execution progress and results
- Logs all actions and tool calls for transparency

---

## 🚀 Getting Started

### Creating an Account

1. **Navigate to the platform**: Visit the landing page
2. **Sign up**: Click "Sign Up" or "Get Started"
3. **Choose your method**:
   - **Email/Password**: Enter your email and create a password
   - **Google OAuth**: Click "Continue with Google" for quick signup
4. **Verify your email** (if using email/password): Check your inbox for a verification link
5. **Complete your profile**: Add your name in "My Account" settings

### Logging In

1. Go to the login page
2. Enter your credentials:
   - Email and password, OR
   - Click "Continue with Google"
3. You'll be redirected to your Dashboard upon successful login

### First Steps

After logging in for the first time:
1. Explore the **Dashboard** to see an overview
2. Check out **Getting Started** section for quick links
3. Review **Quick Actions** for common tasks

---

## 📊 Dashboard Overview

The Dashboard is your central hub for managing your AI automation platform.

### Dashboard Sections

#### Header
- Displays a personalized greeting with your name
- Shows current date and time

#### Statistics Grid
Real-time statistics about your platform usage:
- **Active Agents**: Number of agents you have created
- **Total Workflows**: Number of workflows defined
- **Runs Today**: Workflow executions today
- **Success Rate**: Percentage of successful workflow runs

#### Quick Actions
Shortcuts to common tasks:
- **Create Agent**: Start building a new agent
- **Create Workflow**: Build a new workflow
- **View Agents**: See all your agents
- **View Workflows**: See all your workflows

#### Getting Started
Helpful links for new users:
- **Create Your First Agent**: Step-by-step guide
- **Build a Workflow**: Learn how to chain agents
- **Test an Agent**: Try out an agent interactively

---

## 🤖 Managing Agents

### Understanding Agents

Agents are specialized AI assistants that can:
- Perform specific roles (research, reporting, email, etc.)
- Use tools to interact with external services
- Process natural language instructions
- Return structured results

### Creating an Agent

1. **Navigate to Agents**: Click "Agents" in the sidebar or Dashboard
2. **Click "Create Agent"** (or the "+" button on mobile)
3. **Fill in Basic Information**:
   - **Name**: Give your agent a descriptive name (e.g., "Research Assistant")
   - **Description**: Explain what your agent does (optional but recommended)

4. **Configure the System Role**:
   - Define the agent's expertise and behavior
   - Example: "You are a research assistant specializing in technology trends. Provide concise, accurate summaries with sources."
   - **Tip**: Be specific about the agent's role for better results

5. **Select AI Model**:
   - **GPT-4o**: Best for complex tasks, most capable
   - **GPT-4o Mini**: Fast and efficient, good for most tasks
   - **GPT-4 Turbo**: Powerful and fast
   - **GPT-3.5 Turbo**: Fastest and most cost-effective

6. **Configure Model Parameters**:
   - **Temperature** (0-2): Controls creativity/randomness
     - Lower (0-0.5): More focused and deterministic
     - Higher (1-2): More creative and varied
   - **Max Tokens**: Maximum response length

7. **Enable Tools**:
   - **Web Search**: Search the internet for real-time information
   - **Email**: Send and read emails
   - **Calendar**: Manage calendar events (requires Google Calendar integration)
   - **Database Operations**: Query and manipulate database records

8. **Set Status**:
   - **Active**: Agent is ready to use
   - **Inactive**: Agent is disabled but not deleted
   - **Archived**: Agent is stored but not listed

9. **Save**: Click "Save Agent" to create your agent

### Editing an Agent

1. **Go to Agents page**: Click "Agents" in the sidebar
2. **Click on an agent card**: Opens the agent detail page
3. **Click "Edit"**: Opens the agent builder in edit mode
4. **Make changes**: Update any fields as needed
5. **Save**: Changes are auto-saved (if enabled) or click "Save"

### Testing an Agent

Before using an agent in a workflow, test it individually:

1. **Go to agent detail page**: Click on an agent card
2. **Click "Test Agent"**: Opens the test interface
3. **Enter your message**: Type what you want the agent to do
4. **Click "Send Message"**: Agent processes and responds
5. **View results**: See the agent's response and any tool calls made

### Deleting an Agent

**⚠️ Warning**: Deleting an agent will also remove it from any workflows using it.

1. **Go to agent detail page**: Click on an agent card
2. **Click "Delete"**: Confirms before deletion
3. **Confirm deletion**: Agent is permanently removed

---

## 🔄 Creating and Managing Workflows

### Understanding Workflows

Workflows orchestrate multiple agents in sequence:
- **Step 1**: Agent A processes initial input
- **Step 2**: Agent B receives Agent A's output as input
- **Step 3**: Agent C receives Agent B's output, and so on
- Each step's output automatically becomes the next step's input

### Creating a Workflow

1. **Navigate to Workflows**: Click "Workflows" in the sidebar
2. **Click "Create Workflow"** (or the "+" button on mobile)
3. **Fill in Basic Information**:
   - **Name**: Give your workflow a descriptive name
   - **Description**: Explain what the workflow accomplishes

4. **Add Steps**:
   - Click "Add Step"
   - Select an agent from the dropdown
   - Give the step a name (e.g., "Research Phase", "Report Generation")
   - Repeat for each agent in your workflow

5. **Reorder Steps**:
   - Use ↑ and ↓ buttons to reorder steps
   - Steps execute in the order shown

6. **Set Status**:
   - **Draft**: Workflow is not ready to run
   - **Active**: Workflow is ready to execute
   - **Paused**: Workflow is temporarily disabled
   - **Archived**: Workflow is stored but not listed

7. **Save**: Click "Save Workflow" to create

### Editing a Workflow

1. **Go to Workflows page**: Click "Workflows" in the sidebar
2. **Click on a workflow card**: Opens the workflow detail page
3. **Click "Edit"**: Opens the workflow builder in edit mode
4. **Make changes**: 
   - Add/remove/reorder steps
   - Update name or description
   - Change status
5. **Save**: Changes are auto-saved (if enabled) or click "Save"

### Example Workflows

#### Weekly Report Generator
1. **Step 1** - Research Agent: Search for competitor updates
2. **Step 2** - Report Agent: Summarize findings into a structured report
3. **Step 3** - Email Agent: Send the report to your manager

#### Meeting Preparation
1. **Step 1** - Calendar Agent: Get upcoming meeting details
2. **Step 2** - Research Agent: Gather information about meeting attendees
3. **Step 3** - Report Agent: Create a preparation brief

---

## ▶️ Running Workflows

### Manual Execution

1. **Go to Workflows**: Click "Workflows" in the sidebar
2. **Open a workflow**: Click on a workflow card
3. **Click "Run Workflow"**: Opens the run dialog
4. **Enter input**: Provide the initial input for the first agent
   - Example: "Generate a weekly report on AI industry trends"
5. **Click "Run"**: Workflow starts executing
6. **Monitor progress**: You'll see real-time status updates

### During Execution

The workflow execution screen shows:
- **Overall Status**: Pending, Running, Completed, or Failed
- **Step-by-step Progress**: Each agent's execution status
- **Tool Calls**: Tools used by each agent
- **Timing**: Duration of each step

### Execution States

- **Pending**: Waiting to start
- **Running**: Currently executing
- **Completed**: Successfully finished
- **Failed**: Encountered an error
- **Cancelled**: Manually stopped

---

## 📋 Viewing Execution Results

### Accessing Workflow Runs

1. **Go to Runs**: Click "Runs" in the sidebar
2. **View all runs**: See a list of all workflow executions
3. **Filter by status**: Use status badges to identify runs
4. **Click on a run**: Opens detailed execution view

### Run Detail View

The detail view provides comprehensive information:

#### Header Information
- **Workflow Name**: Which workflow was executed
- **Status Badge**: Current execution status
- **Run ID**: Unique identifier for this run
- **Timing**: Start time, finish time, and duration

#### Execution Timeline
A step-by-step breakdown:
- **Each Agent Step**: 
  - Input received
  - Output generated
  - Status (completed/failed)
  - Duration
- **Tool Calls**: 
  - Which tools were used
  - Parameters passed
  - Results returned
  - Status of each call

#### Input/Output
- **Initial Input**: What you provided to start the workflow
- **Final Output**: The workflow's end result
- **Error Messages**: If execution failed, details about the error

### Understanding Tool Calls

When an agent uses a tool, you'll see:
- **Tool Name**: Which tool was called (web_search, email, etc.)
- **Parameters**: What data was sent to the tool
- **Result**: What the tool returned
- **Status**: Success or failure
- **Timing**: How long the tool took to execute

---

## 🔌 Integrations

### Google Calendar Integration

To enable calendar tools for your agents:

1. **Go to Integrations**: Click "Integrations" in the sidebar
2. **Find Google Calendar**: Locate the Google Calendar card
3. **Click "Connect"**: Opens Google OAuth consent screen
4. **Authorize Access**: Sign in with your Google account
5. **Grant Permissions**: Allow calendar access
6. **Verify Connection**: Status should show "Connected"

Once connected, agents can:
- **List upcoming events**: Get your calendar events
- **Create events**: Schedule meetings automatically

### Disconnecting an Integration

1. **Go to Integrations**: Click "Integrations" in the sidebar
2. **Find the connected service**: Google Calendar card shows "Connected"
3. **Click "Disconnect"**: Removes the connection
4. **Confirm**: Integration is removed

**Note**: Agents using disconnected tools will fail when calling those tools.

---

## ⚙️ Account Settings

### Accessing Settings

Click on your profile icon in the top-right corner, then select **"Settings"**.

### Available Settings

#### Timezone
- Select your timezone for accurate date/time display
- Affects calendar events and timestamps
- Default: UTC

#### Notification Preferences
Control when you receive notifications:
- **Workflow Runs**: Notify on workflow completion/failure
- **Agent Runs**: Notify on agent execution events

#### Default AI Model
- Set your preferred AI model for new agents
- Can be overridden when creating individual agents
- Options: GPT-4o, GPT-4o Mini, GPT-4 Turbo, GPT-3.5 Turbo

#### Auto-save
- **Enabled**: Automatically save changes as you edit
- **Disabled**: Manual save only

### My Account

Access via profile icon → **"My Account"**:

#### Account Details
- View your name and email
- See account creation date
- Check your user role

#### Security Settings
- **Change Password**: Update your account password
- **Delete Account**: Permanently remove your account and all data

**⚠️ Warning**: Account deletion is permanent and cannot be undone.

#### GDPR Rights
- **Export Data**: Download all your data in JSON format
- Includes: Profile, agents, workflows, runs, tool invocations, logs

---

## 💡 Tips & Best Practices

### Agent Design

1. **Be Specific**: Clear, detailed system roles produce better results
   - ❌ Bad: "Help with research"
   - ✅ Good: "You are a technology research specialist. Provide concise summaries with sources, focusing on recent developments."

2. **Choose Appropriate Models**:
   - Complex tasks → GPT-4o
   - Simple tasks → GPT-4o Mini or GPT-3.5 Turbo
   - Balance capability vs. cost

3. **Enable Only Necessary Tools**: 
   - Each tool adds overhead
   - Only enable tools your agent actually needs

4. **Set Appropriate Temperature**:
   - Factual tasks → 0-0.3
   - Creative tasks → 0.7-1.0
   - Balanced → 0.5-0.7

### Workflow Design

1. **Plan the Flow**: Think about data passing between agents
   - Each agent should receive clear, structured input
   - Design outputs to be useful for the next agent

2. **Start Simple**: Begin with 2-3 agents, add complexity gradually

3. **Test Each Agent**: Test agents individually before adding to workflows

4. **Use Descriptive Step Names**: Makes debugging easier

### Testing & Debugging

1. **Test Agents First**: Use "Test Agent" before workflow execution
2. **Check Tool Calls**: Review what tools were used and their results
3. **Review Error Messages**: They often indicate missing configurations
4. **Verify Integrations**: Ensure required integrations are connected

---

## 🔧 Troubleshooting

### Common Issues

#### Agent Execution Fails

**Possible Causes**:
- Missing tool integration (e.g., Calendar tool without Google Calendar connection)
- Invalid input format
- Tool configuration errors

**Solutions**:
1. Check agent's enabled tools
2. Verify required integrations are connected
3. Review error messages in run details
4. Test agent individually to isolate the issue

#### Workflow Stuck in "Running"

**Possible Causes**:
- Long-running task
- Network timeout
- Agent waiting for input

**Solutions**:
1. Wait a few minutes (some workflows take time)
2. Check individual agent status in run details
3. Review logs for timeout errors
4. Contact support if stuck for > 10 minutes

#### Calendar Tool Not Working

**Possible Causes**:
- Google Calendar not connected
- OAuth token expired
- Insufficient permissions

**Solutions**:
1. Go to Integrations → Check Google Calendar status
2. Disconnect and reconnect if needed
3. Ensure you granted calendar permissions
4. Check Google Cloud Console settings

#### Email Tool Not Sending

**Possible Causes**:
- Email configuration not set up (admin)
- Invalid email address format
- SMTP server issues

**Solutions**:
1. Verify email addresses are valid
2. Contact your administrator about email configuration
3. Check error messages for specific issues

### Getting Help

- **Check Documentation**: Review this manual and technical docs
- **Review Error Messages**: They often provide specific guidance
- **Contact Support**: Reach out for assistance with persistent issues

---

## 📚 Additional Resources

### For Administrators

Administrators have access to:
- **Admin Panel**: Manage all users and system settings
- **Tool Configuration**: Set up global tool settings (Email, Web Search, OpenAI)
- **User Management**: View, enable/disable, or delete user accounts
- **System Monitoring**: View all workflow runs across all users

### API & Automation

The platform provides:
- **Server Actions**: For programmatic access
- **Rate Limiting**: To ensure fair usage
- **Structured Logging**: For audit and debugging

---

## 🎓 Quick Reference

### Keyboard Shortcuts

- **/**: Focus search bar
- **Esc**: Close modals/dialogs

### Status Colors

- 🟢 **Green**: Active, Completed, Success
- 🔵 **Blue**: Running, In Progress
- 🔴 **Red**: Failed, Error
- 🟠 **Orange**: Cancelled, Paused
- ⚪ **Gray**: Inactive, Pending, Draft

### Tool Icons

- 🔍 **Web Search**: Search tool
- 📧 **Email**: Email tool
- 📅 **Calendar**: Calendar tool
- 🗄️ **Database**: Database operations tool

---

## ✅ Checklist: Creating Your First Workflow

- [ ] Create at least 2-3 agents with specific roles
- [ ] Test each agent individually
- [ ] Connect required integrations (e.g., Google Calendar)
- [ ] Create a workflow with your agents as steps
- [ ] Run the workflow with test input
- [ ] Review execution results
- [ ] Refine agents and workflow based on results

---

**Last Updated**: December 2024  
**Version**: 1.0

For technical documentation, see [ARCHITECTURE.md](../architecture/ARCHITECTURE.md)  
For setup guides, see [Setup Documentation](../setup/)

