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
Follow the README.md.
This is the current list of files in the app that you can read with functions:
<file>
${fileContent}
</file>
Do not assume the content of the files; read the files you need for context.
This is the current package.json file, if it exists, containing 
the app's dependencies and scripts:
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
    const issue = await taskManager.waitForTask("ready-for-pm");
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
    await taskManager.setLabels(issue, ["done-pm"]);
  }
};

main().catch(console.error);
