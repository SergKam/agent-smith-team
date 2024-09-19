import { run } from "../lib/fileUtils";
import { tool } from "ai";
import { z } from "zod";
import { tryCatch } from "../lib/tryCatch";

export const callNpm = tool({
  description: `Run npm package manager with the given command and parameters.
  Make sure to add non-interactive flags like "--yes" or "--no" to avoid blocking the process.
  Do not run blocking commands like "dev" or "start".
  `,
  parameters: z.object({
    comment: z
      .string()
      .describe("A string that explains the reason for running npm."),
    command: z
      .string()
      .describe('The npm command. For example, "init", "exec" (instead of npx), "install", "test", "run", etc.'),
    parameters: z
      .string()
      .optional()
      .describe("The optional parameters for the npm command."),
  }),
  execute: tryCatch(async ({ comment, command, parameters }) => {
    console.log(`Running npm ${command} ${parameters || ""}`);
    console.log(comment);
    const response = await run(`CI=true npm ${command} ${parameters || ""}`);
    console.log(response);
    return JSON.stringify(response);
  }),
});
