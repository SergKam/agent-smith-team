import { exists } from "../lib/fileUtils";
import fs from "fs/promises";
import { tool } from "ai";
import { z } from "zod";
import { tryCatch } from "../lib/tryCatch";

export const patchFile = tool({
  description: `
    Search and replace the part of the file content.
    The file MUST exist before you can patch it.
    Use this function if the change is less than half of the file.
    Use writeFile function if the change is more than half of the file.
    The search, replace MUST be different.
    The contentString.replace(search, replace) function is used to replace the search part of the file.
  `,
  parameters: z.object({
    comment: z
      .string()
      .describe("A string that explains the reason for the change."),
    filename: z
      .string()
      .describe("The target file path with name and extension."),
    search: z
      .string()
      .describe(
        "The exact part of the file that needs to be replaced. It MUST be exactly the same as in the original file with all spaces and new lines. It should be unique in the file."
      ),
    replace: z
      .string()
      .describe("The new content that will replace the search part."),
  }),
  execute: tryCatch(async ({ comment, filename, search, replace }) => {
    console.log(`Patching file: ${filename}`);
    console.log(comment);

    if (!(await exists(filename))) {
      throw new Error(`File not found: ${filename}`);
    }

    const content = await fs.readFile(filename, "utf8");
    const newContent = content.replace(search, replace);
    if (content === newContent) {
      throw new Error("Search string not found in the file");
    }

    await fs.writeFile(filename, newContent);
    return `File ${filename} patched successfully. The new content is: ${newContent}`;
  }),
});
