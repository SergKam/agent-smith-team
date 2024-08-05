import { exists } from "../lib/fileUtils";
import path from "path";
import fs from "fs/promises";
import { tool } from "ai";
import { z } from "zod";
import { tryCatch } from "../lib/tryCatch";

export const renameFile = tool({
  description: `Rename or move th file to a new location.
    Use this function with patchFile if needed instead of writeFile following by deleteFile.
    `,
  parameters: z.object({
    comment: z
      .string()
      .describe("A string that explains the reason for the change."),
    filename: z
      .string()
      .describe("The target file path with name and extension."),
    renameTo: z
      .string()
      .describe("The new name and path of the file with extension."),
  }),
  execute: tryCatch(async ({ comment, filename, renameTo }) => {
    console.log(`Renaming file: ${filename} to ${renameTo}`);
    console.log(comment);

    if (!(await exists(filename))) {
      throw new Error(`Source file "${filename}" does not exist`);
    }

    const renameFolders = path.dirname(renameTo);
    await fs.mkdir(renameFolders, { recursive: true });
    await fs.rename(filename, renameTo);
    return "File renamed";
  }),
});
