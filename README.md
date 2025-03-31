# Workflow Management Application

A React-based application for creating, managing, and executing custom workflows with API integrations and email capabilities.

## Application Overview

This application allows users to create, edit, execute, and monitor custom workflows. Users can build workflows by connecting different nodes like API calls and email notifications in a visual editor.

## Features

- User registration and authentication
- Dashboard for workflow management
- Visual workflow editor
- Support for API calls and email notifications
- Real-time execution feedback
- Workflow versioning and history

## Current Limitations & Future Roadmap

- **Limited Node Types**: Currently, only API Call and Email nodes are implemented. More node types (conditional logic, delays, data transformation) will be added in future releases.
- **Shortlisting Feature**: The workflow bookmarking/saving feature currently only implements the UI interaction without backend persistence. Full implementation is planned for a future update.
- **Execution History**: A detailed execution history and logging view will be added in upcoming versions.

## Application Flow

### 1. Authentication

#### Registration
1. New users can register by providing their email and password
2. After successful registration, users are redirected to the login page

#### Login
1. Users can login with their email and password
2. After successful login, users are redirected to the dashboard

### 2. Dashboard

The dashboard is the central hub of the application, displaying:
- List of all user workflows
- Search functionality to filter workflows
- Options to create, edit, execute, and delete workflows
- Workflow execution status indicators

#### Workflow Management Actions:
- **Create**: Create a new workflow by clicking the "New Workflow" button
- **Edit**: Modify an existing workflow by clicking the edit icon
- **Execute**: Run a workflow by clicking the play button (shows real-time status)
- **Delete**: Remove a workflow with animated slide-right transition
- **Save/Bookmark**: Mark important workflows for quick access

### 3. Workflow Editor

The visual workflow editor allows users to:
1. Add and connect different types of nodes:
   - Start node (entry point)
   - API Call nodes (for external API integration)
   - Email nodes (for sending notifications)
   - End node (exit point)
   
2. Configure node properties:
   - API Call: Method, URL, Headers, Body
   - Email: Recipient address

3. Save the workflow with a title and description

### 4. Workflow Execution

When executing a workflow from the dashboard:
1. The system processes each node in sequence
2. Real-time status is displayed (spinner → success/error icon)
3. Execution counts are automatically updated
4. Results are shown without requiring page refresh

## Technical Implementation

- **Frontend**: React with hooks
- **State Management**: Context API for workflow and authentication state
- **Routing**: React Router for navigation
- **UI**: Custom components with Tailwind CSS
- **API Communication**: Axios for HTTP requests
- **Visual Editor**: React Flow for workflow diagramming

## Usage Guide

### Creating a Workflow
1. Log in to your account
2. Click "New Workflow" from the dashboard
3. Use the visual editor to add nodes
4. Connect nodes by dragging from output handles to input handles
5. Configure each node with the required parameters
6. Click the document icon to save your workflow with a title and description

### Executing a Workflow
1. From the dashboard, find the workflow you want to execute
2. Click the play button to run the workflow
3. Watch the status indicator for execution progress
4. Green checkmark indicates successful execution
5. Red X indicates an error occurred

### Editing a Workflow
1. Click the edit icon on a workflow from the dashboard
2. Modify the workflow structure or node configurations
3. Wishlist a particular workflow using the document icon

## Security Considerations

- JWT-based authentication
- Secure API token storage
- Input validation to prevent injection attacks
- Request authorization for all API endpoints

---

This application simplifies the creation and management of automated workflows, allowing users to integrate various services without writing code.
