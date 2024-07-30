import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { concatenateFiles, exists, run } from './lib/fileUtils';
import { functions } from './tools/functions';
import request from 'supertest';
import { ChatCompletionCreateParamsNonStreaming } from 'openai/src/resources/chat/completions';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const callChatGPT = async (
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
): Promise<string> => {
  const tools = functions.map((f) => f.definition);
  const request: ChatCompletionCreateParamsNonStreaming = {
    model: 'gpt-4o',
   // response_format: { type: 'json_object' },
    seed: 927364,
    temperature: 0,
    n: 1,
    tool_choice: 'required',
    tools,
    parallel_tool_calls: false,
   // frequency_penalty: -2,
   // presence_penalty: -2,
    messages,
  };
  console.log(JSON.stringify(request, null, 2));
  const completion = await openai.chat.completions.create(request);

  const choice = completion.choices[0];
  console.log(JSON.stringify(choice, null, 2));
  if (!choice || !choice.message.content) {
    throw new Error('No response from GPT-4o');
  }
  if (
    choice.finish_reason !== 'stop' &&
    choice.finish_reason !== 'tool_calls'
  ) {
    throw new Error(
      `GPT-4o did not finish. finish_reason=${choice.finish_reason}`,
    );
  }
  messages.push(choice.message);
  if (choice.finish_reason === 'tool_calls' && choice.message.tool_calls) {
    const toolCalls = choice.message.tool_calls;

    Promise.all(
      toolCalls.map(async (toolCall) => {
        messages.push({
          tool_call_id: toolCall.id,
          role: 'tool',
          content: await callFunction(
            toolCall.function.name,
            toolCall.function.arguments,
          ),
        });
      }),
    );
  } else {
    console.log(choice.message.content);
  }

  return choice.message.content;
};

const callFunction = async (name: string, parameters: string) => {
  const params = JSON.parse(parameters);
  try {
    const command = functions.find((f) => f.definition.function.name === name);
    if (!command) {
      throw new Error(`Function ${name} not found`);
    }
    return (await command.handler(params)) || 'Done';
  } catch (error) {
    return `Error while calling function ${name}: ${error}`;
  }
};

const main = async () => {
  const app = process.argv[2];
  const task = process.argv[3];

  const rootDir = path.resolve(__dirname, '..', '..', '..');

  const setupPrompt = `
    Do not explain anything to me, just give me the TypeScript code. 
    The code should be logically split into files following clean architecture.
    The code should be properly formatted and should be able to run without any errors.
    Write the code in a way that it is easy to understand.
    Pay attention to the naming of variables and functions.
    Think on implementation step by step. 
    Use best practices.  KISS, SOLID, CleanCode, DRY.
    Implement necessary unit and end-to-end test. Make sure to keep the changes minimal.
    Follow the code style and structure of the existing code. 
    Use proper types instead of "any" if possible.
    Use enums instead strings and booleans.
    Use early returns to reduce the nesting and complexity of the code. Dont use "else" keyword if possible.
    Use async/await instead of promises or callbacks.     
    Include changes in all files that are needed to implement working solution.
    Create tests for all branches.
    FYI jest expect(...).rejects.toThrow(..) doesn't work use rejects.toBeInstanceOf(...) instead.
    Use tools function calls to make changes to the code.
    You can run "npm" commands using "callNpm" tool function to build/test the code or add/remove packages.
    Do not change files outside of  src/apps/${app} folder.
    Do not change the existing tests.
    `;
  const fileContent = await concatenateFiles(rootDir, app);
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: setupPrompt,
      name: 'setup',
    },
    { role: 'system', content: fileContent, name: 'content' },
    { role: 'user', content: task, name: 'user' },
  ];
  let retryLeft = 5;
  while (true) {
    await callChatGPT(messages);
    const testResults = await run(`npm test -- --selectProjects ${app}`);
    console.log(testResults.errors);
    if (testResults.testPass) {
      console.log('Success!');
      break;
    }
    if (retryLeft === 0) {
      console.log('Failed after 5 retries. Exiting');
      break;
    }
    retryLeft--;
    console.log('retryLeft', retryLeft);
    if (testResults.errors) {
      messages.push({
        role: 'user',
        name: 'user',
        content: `There is an error while I was running "npm test". 
                    Fix it providing new version of files. Use JSON format as in initial prompt. Only change files
                    needed to fix the problem with tests.
                    Errors: ${testResults.errors}`,
      });
    }
  }
};

main();
