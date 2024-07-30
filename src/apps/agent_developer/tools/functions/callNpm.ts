import { run } from '../../lib/fileUtils';
import { ChatCompletionTool } from 'openai/src/resources/chat/completions';

export const definition: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'callNpm',
    description: 'run npm package manager with the given command',
    parameters: {
      type: 'object',
      properties: {
        comment: {
          description: 'is a string that explains the reason for the change.',
        },
        command: {
          type: 'string',
          description: 'is the npm command. For example, "install", "test", "run", etc.',
        },
        parameters: {
          type: 'string',
          description: 'is the optional parameters for the npm command',
        }
      },
      required: ['command'],
    },
  },
};

export async function handler(params: any) {
  const { command, parameters } = params;
  if (!command) {
    throw new Error('Missing required parameters');
  }

  await run(`npm ${command} -- ${parameters||''}`);
}
