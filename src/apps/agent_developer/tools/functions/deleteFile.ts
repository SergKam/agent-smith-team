import { exists } from '../../lib/fileUtils';
import path from 'path';
import fs from 'fs/promises';
import { ChatCompletionTool } from 'openai/src/resources/chat/completions';

export const definition: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'deleteFile',
    description: 'Delete file',
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
      },
      required: ['filename'],
    },
  },
};

export async function handler(params: any) {
  const { filename } = params;
  if (!filename ) {
    throw new Error('Missing required parameters');
  }
  if (!(await exists(filename))) {
    throw new Error(`File "${filename}" does not exist`);
  }
  await fs.unlink(filename);
}
