import { tool } from "ai";
import { z } from "zod";
import { tryCatch } from "../lib/tryCatch";
import { taskManager } from "../lib/taskManager";

export const addComment = tool({
  description: "Adds a new comments for the task in the task manager",
  parameters: z.object({
    issue: z
      .string()
      .describe('the issue number. For example, "1", "2", "3", etc.'),
    comment: z.string().describe("The text of the comment."),
  }),
  execute: tryCatch(async ({ issue, comment }) => {
    console.log(comment.substring(0, 100));
    const commentResponse = await taskManager.addComment(issue, comment);
    const id = commentResponse?.id;
    return `Comment added successfully #${id}`;
  }),
});
