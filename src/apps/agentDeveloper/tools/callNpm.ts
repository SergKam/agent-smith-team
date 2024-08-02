import { run } from "../lib/fileUtils";
import { tool } from "ai";
import { z } from "zod";
import { tryCatch } from "../lib/tryCatch";

export const callNpm = tool({
  description: "run npm package manager with the given command",
  parameters: z.object({
    comment: z
      .string()
      .describe("A string that explains the reason for running npm."),
    command: z
      .string()
      .describe('The npm command. For example, "install", "test", "run", etc.'),
    parameters: z
      .string()
      .optional()
      .describe("The optional parameters for the npm command."),
  }),
  execute: tryCatch(async ({ comment, command, parameters }) => {
    console.log(`Running npm ${command} ${parameters || ""}`);
    console.log(comment);
    const response = await run(`npm ${command} -- ${parameters || ""}`);
    console.log(response);
    return JSON.stringify(response);
  }),
});
