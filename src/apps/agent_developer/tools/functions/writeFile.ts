import { exists } from '../../lib/fileUtils';
import path from 'path';
import fs from 'fs/promises';
import { ChatCompletionTool } from 'openai/src/resources/chat/completions';

export const definition: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'writeFile',
    description: 'Write content to a file',
    parameters: {
      type: 'object',
      properties: {
        comment: {
          description: 'is a string that explains the reason for the change.',
        },
        filename: {
          type: 'string',
          description: 'is the target file path with name and extension.',
        },
        content: {
          type: 'string',
          description: 'is the content of the file',
        },
      },
      required: ['filename', 'content'],
    },
  },
};

export async function handler(params: any) {
  const { filename, content } = params;
  if (!filename || !content) {
    throw new Error('Missing required parameters');
  }

  if (await exists(filename)) {
    console.log(`Creating File "${filename}"`);
  } else {
    console.log(`Updating File "${filename}"`);
  }

  const folders = path.dirname(filename);
  await fs.mkdir(folders, { recursive: true });
  await fs.writeFile(filename, content);
}
