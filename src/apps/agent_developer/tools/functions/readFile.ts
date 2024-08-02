import { exists } from "../../lib/fileUtils";
import path from "path";
import fs from "fs/promises";
import { ChatCompletionTool } from "openai/src/resources/chat/completions";

export const definition: ChatCompletionTool = {
  type: "function",
  function: {
    name: "readFile",
    description:
      "Read the content to a file for the context. Before you change the file you need to read it",
    parameters: {
      type: "object",
      properties: {
        comment: {
          description: "is a string that explains the reason for the command.",
        },
        filename: {
          type: "string",
          description: "is the target file path with name and extension.",
        },
      },
      required: ["filename"],
    },
  },
};

export async function handler(params: any) {
  const { filename } = params;
  if (!filename) {
    throw new Error("Missing required parameters");
  }

  if (!(await exists(filename))) {
    throw new Error(`File not found: ${filename}`);
  }

  return await fs.readFile(filename, "utf8");
}
