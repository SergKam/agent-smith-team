import { run } from "../lib/fileUtils";
import { tool } from "ai";
import { z } from "zod";
import { tryCatch } from "../lib/tryCatch";
import { taskManager } from "../lib/taskManager";

export const createTask = tool({
  description: "Creates a new Tasks in the task manager",
  parameters: z.object({
    comment: z
      .string()
      .describe("A string that explains the reason for this request."),
    title: z.string().describe("The task title in the task manager."),
    text: z.string().describe("The description text of the task."),
    labels: z.array(z.string()).optional().describe("The labels for the task. Example: ['ready-for-dev', 'ready-for-research' 'ask-for-more-info']"),
  }),
  execute: tryCatch(async ({ comment, title, text, labels }) => {
    console.log(comment);
    const issue = await taskManager.createTask(title, text, labels);
    const id = issue?.number;
    return `Task added successfully #${id}`;
  }),
});
