import path from "path";
import "dotenv/config";

import { listFiles, exists } from "./lib/fileUtils";
import { generateText } from "ai";
import fs from "fs/promises";
import { registry } from "./lib/registry";
import * as tools from "./tools";

import axios from "axios";
import { exec } from "child_process";
import util from "util";
import "dotenv/config";

const execPromise = util.promisify(exec);

const TASK_MANAGER_API_URL = process.env.TASK_MANAGER_API_URL;
if (!TASK_MANAGER_API_URL) {
  throw new Error("TASK_MANAGER_API_URL environment variable is required");
}
const agentId = parseInt(process.env.AGENT_ID || "", 10);
if (!agentId) {
  throw new Error("AGENT_ID environment variable is required");
}
const client = axios.create({
  baseURL: TASK_MANAGER_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.agntId}`,
    "Content-Type": "application/json",
  },
});
const workOnTask = async (task: any) => {
  const app = "app";
  const prompt = task.description;

  const setupPrompt = `
# Role and Objective
You are a professional senior programmer tasked with autonomous coding 
assistance. Your primary goal is to implement functional, well-structured 
TypeScript code based on user instructions.
DO NOT halucinate or make up any information. Only use the information
provided by the user or the existing codebase.

# Core Responsibilities
1. Implement user-requested features or changes
2. Ensure code quality and adherence to best practices
3. Maintain consistency with existing codebase
4. Write and update tests as necessary

# Workflow
1. Analyze the task
   - If ambiguous or unclear, request clarification from the user
   - Break down complex tasks into manageable steps

2. Gather information
   - Read relevant files using parallel_tool_calls when appropriate
   - Examine similar files to understand context and practices
   - Consult documentation or reliable online resources if needed using readWeb.
   - Search for specific information using readWeb with https://www.ecosia.org/search?q={query}. 

3. Implement changes
   - Prefer minimal changes; use patchFile over writeFile when possible
   - Do not change anything that is not directly related to the task
   - Split code into multiple files if necessary, following DDD and clean architecture
   - Implement unit and end-to-end tests for new functionality

4. Review and refine
   - Ensure proper formatting and error-free execution
   - Verify import statements and remove unused imports
   - Run "npm test" to validate changes
   - For debugging, use console.log or console.log(await page.content()) in e2e tests, but remove before committing

5. Finalize
   - If all tests pass, provide a concise git commit message summarizing changes

# Coding Standards
- Write clear, human-readable code with descriptive variable and function names
- Use TypeScript types effectively; avoid "any" when possible
- Employ enums instead of strings or booleans where appropriate
- Utilize early returns to reduce nesting; minimize use of "else"
- Prefer async/await over promises or callbacks
- Use functional programming principles when applicable
- Write modern TypeScript code with ES6+ features
- Keep files small and focused on single responsibilities
- Follow existing code style and structure

# Output
Do not chit-chat with the user. Use dry technical tone.
Provide only the functional TypeScript code without explanations, unless
specifically requested by the user.

Remember: Your primary focus is on producing high-quality, working code that
adheres to best practices and seamlessly integrates with the existing codebase.
    `;

  const fileContent = await listFiles();

  const readmeFile = "README.md";
  const readme =
    (await exists(readmeFile)) && (await fs.readFile(readmeFile, "utf8"));

  const packageJson =
    (await exists("package.json")) &&
    (await fs.readFile("package.json", "utf8"));

  const system = `
    ${setupPrompt}
    You are working on the app: ${app}
    This is the apps ${readmeFile} : 
    [file start]
    ${readme}
    [file end]
    Follow the readme. You would need to update this README.md file with the changes you made if needed.
    This is the current list of files in the app that you can read or modify with functions:
    [list start]
    ${fileContent}
    [list end]
    Do not assume the content of the files, read the file you need for the context.
    You can run "npm" commands using "callNpm" tool function to build/test the code or add/remove packages.
    This is the current package.json file:
    [file start]
    ${packageJson}
    [file end]
    `;
  console.log(system);
  const result = await generateText({
    model: registry.languageModel(process.env.AI_MODEL || "openai:gpt-4o"),
    seed: 927364,
    temperature: 0,
    maxToolRoundtrips: 100,
    tools,
    system,
    prompt,
  });

  console.dir("text", result.text);
  console.log("finish", result.finishReason);
  console.log("usage", result.usage);
  console.dir(result.roundtrips, { depth: null });
  return result;
};

const fetchTask = async () => {
  try {
    const filter = JSON.stringify({ status: "pending", assignedTo: agentId });
    const response = await client.get(`/tasks?filter=${filter}`);
    if (response.data && response.data.length > 0) {
      return response.data[0]; // Assuming the first task is the one to be processed
    }
    return null;
  } catch (error: any) {
    console.error("Error fetching task:", error.message);
    return null;
  }
};

const runTask = async (task: any) => {
  try {
    const repoUrl = process.env.REPO_URL;
    if (!repoUrl) {
      throw new Error("REPO_URL environment variable is required");
    }
    //remove directory
    await execPromise(`rm -rf workspace`);
    // Clone the repository
    await execPromise(`git clone ${repoUrl} workspace`);

    // Navigate to the 'work' directory
    process.chdir("workspace");

    // Create a new branch with the task ID
    await execPromise(`git checkout -b task-${task.id}`);

    const result = await workOnTask(task);

    // Commit the changes
    await execPromise(`git add .`);
    await execPromise(
      'git config --global user.email "agent.smith@example.com"'
    );
    await execPromise('git config --global user.name "Agent Smith"');
    await execPromise(`git commit  -m 'Task ${task.id}: ${result.text}'`);

    // Push the changes
    await execPromise(`git push origin task-${task.id}`);

    // Return to the original directory
    process.chdir("..");

    return { stdout: JSON.stringify(result.roundtrips, null, 4), stderr: "" };
  } catch (error) {
    console.error("Error running task:", error);
    return { stdout: "", stderr: `${error}` };
  }
};
const finishTask = async (task: any, stdout: string, stderr: string) => {
  try {
    await client.put(`tasks/${task.id}`, {
      ...task,
      userId: agentId,
      status: "completed",
    });

    await client.post(`comments`, {
      taskId: task.id,
      userId: agentId,
      content: `Task completed. Output: ${stdout}. Error: ${stderr}`,
    });

    console.log("Task completed successfully");
  } catch (error: any) {
    console.error("Error finishing task:", error.message, error.response?.data);
  }
};

const main = async () => {
  while (true) {
    const task = await fetchTask();
    if (!task) {
      console.log("No tasks available. Retrying in 10 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 10000));
      continue;
    }
    let { stdout, stderr } = await runTask(task);
    await finishTask(task, stdout, stderr);
  }
};

main().catch(console.error);
