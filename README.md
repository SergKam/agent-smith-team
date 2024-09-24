# Agent Smith Team

Agent Developer is a TypeScript-based project designed to automate various tasks using AI agents.
Primarily it is designed to automate the software development process, but it can be used for other purposes as well. 
The project is
structured to handle different roles such as developers, architects, and product managers, each with specific
responsibilities and workflows.

## Features

- **Role-Based Agents**: Agents are designed to handle different roles, such as developers, architects, and product
  - **Developer Agent**: Implements user-requested features or changes, ensuring code quality and maintaining consistency
    with the existing codebase.
  - **Architect Agent**: Provides guidance and direction to the development team, refines requirements, and proposes
    solution plans.
  - **Product Manager Agent**: Clarifies all technical requirements so that the software architect can create an
    implementation plan.
- **GitHub Integration**: Agents can interact with GitHub to create, update, and assign issues.
- **Any LLM Model**: Agents can use any LLM model supported by Vercel AI SDK (OpenAi Gpt-4o and Anthropic Claude 3.5 Sonnet works best).
- **Tools**: Agents can use various tools to automate tasks, such as reading files, fetching web content, and running
  bash commands.
- **TypeScript**: The project is written in TypeScript, and focused on the development for a typical TypesScript/node.js project.

## Installation

To install the necessary dependencies, run the appropriate package manager command.
  
```bash 
npm install
```


## Usage

The each agent has a specific set of instructions and tools that can be used to automate tasks.

Theoretically, the agents should be run in a separate container or environment to avoid conflicts and security issues.
The agents can be run using the following command:
```bash
npm run start:{agent}
```
When an agent is started, it will start querying the task manager for new tasks and execute them.
Currently task manager is a GitHub issue tracker, but it can be replaced with any other task manager.
In GitHub we use labels to identify the workflow step and the agent that should execute the task. 
For example, "ready-for-architect" or "ready-for-dev".
Agents will only execute tasks that are assigned to them. After the task is completed, the agent will update the issue
with the result and can assign it to the next agent or human.


## Tools
Tools are commands that agents can use to automate tasks.
The following are some of the available tools and commands:
- **readFile**: Reads the content of a file for the context.
- **readWeb**: Fetches and returns the text content of a web page using Puppeteer and html-to-text.
- **callNpm**: Runs npm package manager with the given command and parameters.
- **deleteFile**: Deletes a specified file.
- **renameFile**: Renames or moves a file to a new location.
- **writeFile**: Writes content to a file. If the file already exists, it will be overwritten.
- **patchFile**: Searches and replaces part of the file content.
- **createTask**: Creates a new task in the task manager.
- **addComment**: Adds a new comment for the task in the task manager.
- **bash**: Runs a bash command in a Ubuntu Linux environment (insecure, use with caution).

* Future plans for tools to provide:
  * deep code analysis like 
    * signature extraction, code similarity, and code quality checks.
    * code editing and refactoring like renaming variables, extracting methods, and fixing code style issues.
  * research and documentation tools like 
    * searching for information on the web, summarizing articles, and generating documentation.
  * Database tools like 
    * querying databases, updating records, and generating reports.
    * functions runner for data processing and analysis.
  * RAG (Retrieval Augmented Generation) models for generating code, documentation, and reports.  


## Agents


### Product Manager Agent

Clarifies all technical requirements so that the software architect can create an implementation plan.

### Architect Agent

Provides guidance and direction to the development agents, refines requirements,proposes solution plans,
and create necessary subtasks.

### Developer Agent

Responsible for implementing user-requested features or changes, ensuring code quality, and maintaining consistency with
the existing codebase.

### Future Agents
* **QA Agent**: Responsible for testing the code and ensuring that it meets the requirements.
* **DevOps Agent**: Responsible for deploying the code to the production environment.
* **Security Agent**: Responsible for ensuring that the code is secure and meets the security requirements.
* **Data Scientist Agent**: Responsible for analyzing data and providing insights.
* **Research Agent**: Responsible for researching new technologies and providing recommendations.
* **Documentation Agent**: Responsible for creating and maintaining documentation.
* **Support Agent**: Responsible for providing support to users and resolving issues.
* **Legal Agent**: Responsible for ensuring that the project complies with legal requirements.
* **Monitoring Agent**: Responsible for monitoring the project and alerting on issues.

* **Meta Agent**: Responsible for creating other agents, assigning tasks, and coordinating the workflow. 

## Environment Variables

The application uses several environment variables, which should be set in a `.env` file. These include tokens, user
information, and API keys.
```bash
# Default AI model to use for the agents
AI_MODEL=anthropic:claude-3-5-sonnet-20240620
# Anthropic API key. See https://api.anthropic.com/docs
ANTHROPIC_API_KEY=your_anthropic_api_key
```
Or OpenAI model:
```bash
AI_MODEL=openai:gpt-4o
# OpenAI API key. See https://platform.openai.com/docs/guides/authentication
OPENAI_KEY=your_openai_key
```

```bash
# GitHub repository owner(user or org) and name
REPO_OWNER=SergKam
REPO_NAME=learning-games

# Human GH username that will be used to assign review tasks to
# It should be a member of the repository with write access
HUMAN_USER=SergKam

# Robot GH username that will be used to perform automated tasks
# It should be a member of the repository with write access
ROBOT_USER=SergKam-dev-agent

# Robot user access token with full repository access
GITHUB_TOKEN=full-repo-access-token-here-for-robot-user

# Robot user email
ROBOT_USER_EMAIL=example+dev-agent@gmail.com

# The Robot user private SSH key for Agent to use git commands
GIT_SSH_COMMAND='ssh -i ~/.ssh/id_ed25519 -o IdentitiesOnly=yes'
```


## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Commit your changes.
5. Push to the branch.
6. Open a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
