import "dotenv/config";
import { listFiles, exists } from "../lib/fileUtils";
import { generateText } from "ai";
import fs from "fs/promises";
import { registry } from "../lib/registry";
import * as tools from "../tools";
import { exec } from "child_process";
import util from "util";
import { taskManager } from "../lib/taskManager";
import { Issue } from "../lib/github/ghTypes";

const execPromise = util.promisify(exec);

const workOnTask = async (issue: Issue) => {
  const app = issue.repository_url;
  const prompt = `
  issue number: #${issue.number}
  title:${issue.title}
  description: ${issue.body}
  comment: ${issue.comment_bodies.join("\n\ncomment:\n")}
  `;

  const setupPrompt = `
# Role and Objective
You are a professional senior programmer tasked with autonomous coding 
and debugging. Your primary goal is to implement functional, well-structured 
TypeScript code based on user instructions.
DO NOT hallucinate or make up any information. Only use the information
provided by the user or the existing codebase.

# Core Responsibilities
1. Understand the requirements and the context  
2. Implement user-requested features or changes
3. Ensure code quality and adherence to best practices
4. Maintain consistency with existing codebase
5. Write and update tests as necessary

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
   - Split code into multiple files if necessary, following DDD
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
This is the app's ${readmeFile}: 
<file>
${readme}
</file>
Follow the README.md. You may need to update this README.md file with any changes you make.
This is the current list of files in the app that you can read or modify with functions:
<file>
${fileContent}
</file>
Do not assume the content of the files; read the files you need for context.
You can run "npm" commands using the "callNpm" tool function to build/test the code or add/remove packages.
This is the current package.json file:
<file>
${packageJson}
</file>
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

const runTask = async (issue: any) => {
  try {
    // Remove directory
    await execPromise(`rm -rf workspace`);
    // Clone the repository
    const repo = issue.repository_url.replace(
      "https://api.github.com/repos/",
      ""
    );
    await execPromise(`git clone git@github.com:${repo}.git workspace`);

    // Navigate to the 'workspace' directory
    process.chdir("workspace");

    // Create a new branch with the issue number
    const safeTitle = issue.title
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, "-")
      .substring(0, 50);
    const branch = `issue-${issue.number}-${safeTitle}`;
    await execPromise(`git checkout -b ${branch}`);

    const result = await workOnTask(issue);

    // Commit the changes
    await execPromise(`git add .`);
    await execPromise(
      'git config --global user.email "agent.smith@example.com"'
    );
    await execPromise('git config --global user.name "Agent Smith"');
    await execPromise(`git commit -m 'Issue #${issue.number}: ${result.text}'`);

    // Push the changes
    await execPromise(`git push origin ${branch}`);

    // Return to the original directory
    process.chdir("..");

    return { stdout: JSON.stringify(result.roundtrips, null, 4), stderr: "" };
  } catch (error) {
    console.error("Error running task:", error);
    return { stdout: "", stderr: `${error}` };
  }
};

const main = async () => {

  while (true) {
    const issue = await taskManager.waitForTask("ready-for-dev");
    const { stdout, stderr } = await runTask(issue);

    await taskManager.addComment(
      issue.number + "",
      `--logs--
      Task ${stderr.trim() ? "failed" : "completed"}.
      <details><summary>Details</summary>
      <p>
      Output:\n\`\`\`\n${stdout}\n\`\`\`\n\nError:\n\`\`\`\n${stderr}\n\`\`\`
      </p>
      </details>`
    );
    await taskManager.createPullRequest(issue);
    await taskManager.setLabels(issue, ["code-review"]);
  }
};

main().catch(console.error);
