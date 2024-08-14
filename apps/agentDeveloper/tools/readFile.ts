import { exists } from "../lib/fileUtils";
import fs from "fs/promises";
import { tool } from "ai";
import { z } from "zod";
import { tryCatch } from "../lib/tryCatch";

export const readFile = tool({
  description: `Read the content to a file for the context. 
  Before you change the file you need to read it. Use parallel_tool_calls to read multiple files.
  `,
  parameters: z.object({
    comment: z
      .string()
      .describe("A string that explains the reason for the command."),
    filename: z
      .string()
      .describe("The target file path with name and extension."),
  }),
  execute: tryCatch(async ({ comment, filename }) => {
    console.log(`Reading file: ${filename}`);
    console.log(comment);

    if (!(await exists(filename))) {
      throw new Error(`File not found: ${filename}`);
    }

    return await fs.readFile(filename, "utf8");
  }),
});
