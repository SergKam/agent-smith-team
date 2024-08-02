import { exists } from "../lib/fileUtils";
import path from "path";
import fs from "fs/promises";
import { tool } from "ai";
import { z } from "zod";

export const writeFile = tool({
  description: `Write content to a file. 
    If the file already exists, it will be overwritten. 
    If the file does not exist, it will be created.
    If file exists and the the change is less then half of the file use patchFile function instead.
    Don't forget to read the file before you write it.
    Don't call this function if the content is the same as the original file.
    `,
  parameters: z.object({
    comment: z
      .string()
      .describe("A string that explains the reason for the change."),
    filename: z
      .string()
      .describe("The target file path with name and extension."),
    content: z.string().describe("The content of the file"),
  }),
  execute: async ({ comment, filename, content }) => {
    if (await exists(filename)) {
      console.log(`Updating File "${filename}"`);
    } else {
      console.log(`Creating File "${filename}"`);
    }
    console.log(comment);

    const folders = path.dirname(filename);
    await fs.mkdir(folders, { recursive: true });
    await fs.writeFile(filename, content);
  },
});
