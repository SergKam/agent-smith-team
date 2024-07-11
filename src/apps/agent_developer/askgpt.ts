import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { concatenateFiles, exists, run } from './lib/fileUtils';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const callChatGPT = async (
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
): Promise<string> => {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    seed: 927364,
    temperature: 0.1,
    top_p: 1,
    messages,
  });
  const choice = completion.choices[0];
  if (!choice || !choice.message.content) {
    throw new Error('No response from GPT-4o');
  }
  if (choice.finish_reason !== 'stop') {
    throw new Error(
      `GPT-4o did not finish. finish_reason=${choice.finish_reason}`,
    );
  }
  const content = choice.message.content;
  console.log(choice);
  messages.push({
    role: 'assistant',
    name: 'assistant',
    content,
  });

  return content;
};

const processCommand = async (command: string) => {
  const file = JSON.parse(command);

  switch (file.operation) {
    case 'create':
      if (await exists(file.name)) {
        console.warn(`File "${file.name}" already exists`);
      }

      const folders = path.dirname(file.name);
      await fs.mkdir(folders, { recursive: true });
      await fs.writeFile(file.name, file.content);
      break;

    case 'update':
      if (!(await exists(file.name))) {
        throw new Error(`File "${file.name}" does not exist`);
      }
      await fs.writeFile(file.name, file.content);
      break;

    case 'delete':
      if (!(await exists(file.name))) {
        throw new Error(`File "${file.name}" does not exist`);
      }
      await fs.unlink(file.name);
      break;
    default:
      throw new Error(
        `Invalid operation "${file.operation}" for file "${file.name}"`,
      );
  }
  return file.finished;
};

const generateCode = async (
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
) => {
  while (true) {
    const chatGPTResponse = await callChatGPT(messages);

    const finished = await processCommand(chatGPTResponse);
    if (finished) {
      return;
    }

    messages.push({
      role: 'user',
      name: 'user',
      content: 'continue',
    });
  }
};

const main = async () => {
  const setupPrompt = `
    Do not explain anything to me, just give me the TypeScript code. 
    The code should be logically split into files following clean architecture.
    the code should be properly formatted and should be able to run without any errors.
    Write the code in a way that it is easy to understand.
    Pay attention to the naming of variables and functions.
    Think on implementation step by step. 
    Use best practices.  KISS, SOLID, CleanCode, DRY.
    Implement necessary unit and end-to-end test. Make sure to keep the changes minimal.
    Follow the code style and structure of the existing code. 
    Use proper types instead of "any" is possible.
    Use enums instead strings and booleans.
    Use early returns to reduce the complexity of the code.
    Use async/await instead of promises or callbacks.     
    Include changes in all files that are needed to implement working solution.
    Create tests for all branches.
    FYI jest expect(...).rejects.toThrow(..) doesn't work use rejects.toBeInstanceOf(...) instead.
    For each file you want to create, update, or delete you create a separate answer one command a a time.
    I will confirm if you can proceed to the next step with the key word "continue".
    Each you answer should be in JSON format.
  
    Where each object contains fields:
    - "operation" is what change need to be done on that file, one of "create", "update", "delete".
    - "comment" is a string that explains the reason for the change.
    - "finished" is a boolean that indicates if you are done with the whole task.    
    - "name" is the file path with name and extension.
    - "content" is the content of the file.
    `;
  const app = process.argv[2];
  const task = process.argv[3];

  const rootDir = path.resolve(__dirname, '..', '..', '..');
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
    await generateCode(messages);
    const testResults = await run('npm test');
    if (testResults.testPass) {
      console.log('Success!');
      break;
    }
    if (retryLeft === 0) {
      console.log('Failed after 5 retries. Exiting');
      break;
    }
    retryLeft--;
    console.log(testResults.errors);
    console.log('retryLeft', retryLeft);
    if (testResults.errors) {
      messages.push({
        role: 'user',
        name: 'user',
        content: `There is an error while i was running "npm test". 
                    Fix it providing new version of files. Use JSON format as in initial prompt. Only change files
                    needed to fix the problem with tests.
                    Errors: ${testResults.errors}`,
      });
    }
  }
};

main();
