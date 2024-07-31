import { run } from '../../lib/fileUtils';
import { ChatCompletionTool } from 'openai/src/resources/chat/completions';

export const definition: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'done',
    description: 'Submit the task as done',
    parameters: {
      type: 'object',
      properties: {
        message: {
          description: 'Git commit message',
        },
      },
      required: ['command'],
    },
  },
};

export async function handler(params: any) {
  const { message } = params;
  if (!message) {
    throw new Error('Missing required parameters');
  }

  console.log(`Committing changes with message: ${message}`);
  return ''
}
