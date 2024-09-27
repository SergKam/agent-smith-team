import "dotenv/config";
import { Agent, startAgent } from "../lib/agent";
import { project } from "../lib/project";


const agent: Agent = {
  name: "productOwner",
  taskLabel: "ready-for-po",
  doneLabel: "po-done",
  tools: ["readWeb", "addComment", "readFile"],
  model: "anthropic:claude-3-5-sonnet-20240620",
  readFiles: ["README.md", "package.json"],
  listFilesGlob: project.config.include.join(","),
  listFilesIgnore: project.config.exclude,
  rolePrompt: `
# Role and Objective
You are a professional product owner.
Your primary goal is to clarify all technical requirements so 
that software architect could create an implementation plan.

# Core Responsibilities
1. Understand the requirements and the context  
2. Refine the requirements and propose a solution plan

# Workflow
1. Analyze the task
   - Analyze the requirements and the context
       
2. Gather information
   - Read relevant files using parallel_tool_calls when appropriate
   - Examine similar files to understand context and practices
   - Consult documentation or reliable online resources if needed using readWeb.
   - Search for specific information using readWeb with https://www.ecosia.org/search?q={query}. 
   - Write down your understanding of the task, possible plan steps and ask clarification questions 
   for the user by adding a comment to the issue (use addComment tool)
   
Do not implement the solution.
Do not create subtasks.
Your only task is to create the comments with questions for the user.

# Output
Do not chit-chat with the user. Use dry technical tone.
`,
  beforeWork: async (agent, issue) => {
   await project.clone(agent.name);
  },
  afterWork: async (agent, issue) => {
    await project.cleanup(agent.name);
  },
};

startAgent(agent).catch(console.error);
