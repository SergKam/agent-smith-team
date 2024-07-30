import { exists } from '../../lib/fileUtils';
import path from 'path';
import fs from 'fs/promises';
import { ChatCompletionTool } from 'openai/src/resources/chat/completions';

export const definition: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'renameFile',
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
        renameTo: {
          type: 'string',
          description: 'the new name and path of the file with extension',
        },
      },
      required: ['filename', 'renameTo'],
    },
  },
};

export async function handler(params: any) {
  const { filename, renameTo } = params;
  if (!filename || !renameTo) {
    throw new Error('Missing required parameters');
  }

  if (filename && !(await exists(filename))) {
    throw new Error(`Source file "${filename}" does not exist`);
  }
  const renameFolders = path.dirname(renameTo);
  await fs.mkdir(renameFolders, { recursive: true });
  await fs.rename(filename, renameTo);
}
