import { exists } from "../lib/fileUtils";
import fs from "fs/promises";
import { tool } from "ai";
import { z } from "zod";

export const deleteFile = tool({
  description: "Delete a file",
  parameters: z.object({
    comment: z
      .string()
      .describe("A string that explains the reason for the change."),
    filename: z
      .string()
      .describe("The target file path with name and extension."),
  }),
  execute: async ({ comment, filename }) => {
    console.log(`Deleting file: ${filename}`);
    console.log(comment);

    if (!filename) {
      throw new Error("Missing required parameters");
    }

    if (!(await exists(filename))) {
      throw new Error(`File "${filename}" does not exist`);
    }

    await fs.unlink(filename);
    return "File deleted";
  },
});
