import { run } from "../lib/fileUtils";
import { tool } from "ai";
import { z } from "zod";
import { tryCatch } from "../lib/tryCatch";

export const callBash = tool({
  description: `Run bash command in a Ubuntu Linux.
  `,
  parameters: z.object({
    comment: z
      .string()
      .describe("A string that explains the reason for running CLI."),
    command: z
      .string()
      .describe('The bash command with parameters. For example, "ps", "ls -a", "mkdir", etc.'),

  }),
  execute: tryCatch(async ({ comment, command}) => {
    console.log(`Running bash: ${command} `);
    console.log(comment);
    const response = await run(command);
    console.log(response);
    return JSON.stringify(response);
  }),
});
