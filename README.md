# Agent Smith Team

AI agents workspace in Node.js

## Overview

The Agent Smith Team project is a comprehensive workspace that integrates multiple applications to facilitate task management and AI agent interaction. The project is structured into three main applications:

1. **UI Application**: Provides an admin interface for task development workflow and interaction with AI agents using React Admin. It utilizes the task manager API to fetch and update data.

2. **Task Manager Application**: Implements a domain-driven design and clean architecture to manage tasks and users. It uses an API-first approach with OpenAPI specifications to define and validate API routes.

3. **Agent Developer**: Provides tools for reading file content and fetching web page text content, aiding in the development and testing of AI agents.

## Installation

To install the necessary dependencies for all applications, run:

```bash
npm install
```

## Run

To start the applications, use the following command:

```bash
npm start
```

## Test

Run tests for all applications using:

```bash
npm test
```

## Lint

To lint the codebase, use:

```bash
npm run lint
```

## Build

To build the applications, use:

```bash
npm run build
```

## Applications

### UI Application

- **Framework**: React Admin
- **Build Tool**: Vite
- **Features**: Task management interface, user assignment, comment management

### Task Manager Application

- **Architecture**: Domain-driven design, clean architecture
- **Technologies**: TypeScript, Express, MySQL, Jest
- **Features**: User and task management, API-first approach with OpenAPI

### Agent Developer

- **Tools**: File reading, web content fetching
- **Usage**: Import tools from the `tools` directory for development and testing

## Key Technologies

- **React Admin**: For building admin interfaces
- **Express**: Web framework for Node.js
- **MySQL**: Relational database management system
- **Jest**: Testing framework
- **OpenAPI**: API specification for defining and validating API routes

## Environment Variables

The applications use `dotenv` to load environment variables from a `.env` file. Key variables include:

- `DB_HOST`: Database host
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `PORT`: Server port

## Database Schema

The database schema includes tables for users, tasks, task relations, and comments, defined in the `schema.sql` file of the Task Manager application.

## Testing

The project uses Jest for unit and API testing. Test files are located alongside the files they test and follow the naming convention `*.test.ts`.

_Note_: The tests require a running MySQL database. You can start a MySQL instance using the `npm run mysql` command.

_Warning_: In Jest, `expect(...).rejects.toThrow(...)` doesn't work; use `expect(...).rejects.toBeInstanceOf(...)` instead.