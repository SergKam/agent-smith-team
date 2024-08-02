import { exists } from '../../lib/fileUtils';
import path from 'path';
import fs from 'fs/promises';
import { ChatCompletionTool } from 'openai/src/resources/chat/completions';

export const definition: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'renameFile',
    description: `Rename or move th file to a new location.
    Use this function with patchFile if needed instead of writeFile following by deleteFile.
    `,
    parameters: {
      type: 'object',
      properties: {
        comment: {
          description: 'is a string that explains the reason for the change.',
        },
        filename: {
          type: 'string',
          description: 'is the target file path with name and extension. The file must exist.',
        },
        renameTo: {
          type: 'string',
          description: 'the new name and path of the file with extension. The folders will be created recursively if they do not exist.',
        },
      },
      required: ['filename', 'renameTo', 'comment'],
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
