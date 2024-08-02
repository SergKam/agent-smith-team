import { exists } from '../../lib/fileUtils';
import path from 'path';
import fs from 'fs/promises';
import { ChatCompletionTool } from 'openai/src/resources/chat/completions';

export const definition: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'patchFile',
    description: `
    Search and replace tha part of the file content.
    The file MUST exist before you can patch it.
    Use this function if the change is less then half of the file.
    Use writeFile function if the change is more then half of the file.
    The search, replace MUST be different.
    The contentString.replace(search, replace) function is used to replace the search part of the file. 
    `,
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
        search: {
          type: 'string',
          description: 'the exact part of the file that need to be replaced. It MUST be exactly the same as in original file with all spaces and new lines. It should be unique in the file.',
        },
        replace: {
          type: 'string',
          description: 'the new content that will replace the search part.',
        },
      },
      required: ['filename', 'search', 'replace', 'comment'],
    },
  },
};

export async function handler(params: any) {
  const { filename, search, replace } = params;
  if (!filename || !search || !replace) {
    throw new Error('Missing required parameters');
  }

  if (!await exists(filename)) {
    throw new Error(`File not found: ${filename}`);
  }

  const folders = path.dirname(filename);
  const content = await fs.readFile(filename, 'utf8');
  const newContent = content.replace(search, replace);
  if (content === newContent) {
    throw new Error('Search string not found in the file');
  }
  await fs.writeFile(filename, newContent);
}
