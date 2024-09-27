import "dotenv/config";
import { listFiles, exists, sleep } from "./fileUtils";
import { generateText, GenerateTextResult } from "ai";
import fs from "fs/promises";
import { registry } from "./registry";
import * as tools from "../tools";
import { taskManager } from "./taskManager";
import { Issue } from "./github/ghTypes";

export type Agent = {
  name: string;
  taskLabel: string;
  doneLabel: string;
  rolePrompt: string;
  model?: string;
  readFiles?: string[];
  listFilesGlob?: string;
  listFilesIgnore?: string[];
  context?: Record<string, any>;
  tools?: any[];
  beforeWork: (agent: Agent, issue: Issue) => Promise<void>;
  afterWork: (
    agent: Agent,
    issue: Issue,
    results: GenerateTextResult<any>
  ) => Promise<void>;
};

const workOnTask = async (agent: Agent, issue: Issue) => {
  const app = issue.repository_url;
  const prompt = `
  issue number: #${issue.number}
  title:${issue.title}
  description: ${issue.body}
  comment: ${issue.comment_bodies.join("\n\ncomment:\n")}
  `;

  const setupPrompt = agent.rolePrompt;

  const filesList = await listFiles(
    agent.listFilesGlob || `./**`,
    agent.listFilesIgnore || []
  );

  const filesContent = !agent.readFiles
    ? ""
    : (
        await Promise.all(
          agent.readFiles.map(async (filename: string) => {
            return {
              file: filename,
              content:
                (await exists(filename)) &&
                (await fs.readFile(filename, "utf8")),
            };
          })
        )
      )
        .filter((file) => file.content)
        .map(({ file, content }) => `<file src="${file}">\n${content}\n</file>`)
        .join("\n");

  const system = `
${setupPrompt}
You are working on the app: ${app}

Do not assume the content of the files; read the files you need for context.
This is the current list of files in the app workspace that you can read or modify with functions:
<files>
${filesList}
</files>

This is some pre-loaded files for the context.
${filesContent}
`;

  const agentTools = !agent.tools
    ? tools
    : Object.fromEntries(
        Object.entries(tools).filter(([key]) => agent.tools?.includes(key))
      );

  console.log(system);
  console.log(prompt);
  const result = await generateText({
    model: registry.languageModel(
      agent.model || process.env.AI_MODEL || "openai:gpt-4o"
    ),
    seed: 927364,
    temperature: 0,
    maxToolRoundtrips: 100,
    tools: agentTools,
    system,
    prompt,
    onStepFinish: async (step) => {
      console.log("Step finished", step.stepType);
      console.dir(step, { depth: null });
    },
  });

  console.dir("text", result.text);
  console.log("finish", result.finishReason);
  console.log("usage", result.usage);
  return result;
};

const runTask = async (agent: Agent, issue: Issue) => {
  try {
    await agent?.beforeWork(agent, issue);

    const result = await workOnTask(agent, issue);

    await agent?.afterWork(agent, issue, result);

    return { stdout: JSON.stringify(result.steps, null, 4), stderr: "" };
  } catch (error) {
    console.error("Error running task:", error);
    return { stdout: "", stderr: `${error}` };
  }
};

let working = true;
process.on("SIGINT", async () => {
  working = false;
  console.log("Got SIGINT. Gracefully stopping the process");
  await sleep(10000);
  process.exit();
});

export const startAgent = async (agent: Agent) => {
  console.log(`Starting ${agent.name} agent`);
  agent.context = agent.context || {};
  while (working) {
    const issue = await taskManager.fetchTask(agent.taskLabel);
    if (!issue) {
      await sleep(5000);
      continue;
    }

    const { stdout, stderr } = await runTask(agent, issue);

    await taskManager.addComment(
      issue.number + "",
      `--logs--
      Agent: ${agent.name} 
      Task ${stderr.trim() ? "failed" : "completed"}.
      <details><summary>Details</summary>
      <p>
      Output:\n\`\`\`\n${stdout}\n\`\`\`\n\nError:\n\`\`\`\n${stderr}\n\`\`\`
      </p>
      </details>`
    );

    await taskManager.setLabels(issue, [agent.doneLabel]);
  }
};
