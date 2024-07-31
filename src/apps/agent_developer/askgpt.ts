import path from "path";
import dotenv from "dotenv";
import OpenAI from "openai";
import { concatenateFiles, exists } from "./lib/fileUtils";
import { functions } from "./tools/functions";
import { ChatCompletionCreateParamsNonStreaming } from "openai/src/resources/chat/completions";
import fs from "fs/promises";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const callChatGPT = async (
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  attemptsLeft = 100
) => {
  const tools = functions.map((f) => f.definition);
  const request: ChatCompletionCreateParamsNonStreaming = {
    model: "gpt-4o",
    response_format: { type: "json_object" },
    seed: 927364,
    temperature: 0,
    n: 1,
    tool_choice: "required",
    tools,
    parallel_tool_calls: true,
    // frequency_penalty: -2,
    // presence_penalty: -2,
    messages,
  };
  //console.log(JSON.stringify(request, null, 2));
  const completion = await openai.chat.completions.create(request);

  const choice = completion.choices[0];
  console.log(completion.usage)
  console.dir(choice, { depth: 10});
  if (!choice || !choice.message) {
    throw new Error("No response from GPT-4o");
  }
  if (choice.finish_reason !== "stop") {
    throw new Error(
      `GPT-4o did not finish. finish_reason=${choice.finish_reason}`
    );
  }

  const message: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
    ...choice.message,
    tool_calls: choice.message.tool_calls?.map((toolCall) => ({
      ...toolCall,
      function: {
        ...toolCall.function,
        name: toolCall.function.name.replace("functions:", ""),
      },
    })),
  };

  messages.push(message);
  if (!choice.message.tool_calls) {
    console.log(choice.message.content);
    return;
  }

  const toolCalls = choice.message.tool_calls;
  let isDone = false;
  for (const toolCall of toolCalls) {
    const name = toolCall.function.name.replace("functions:", "");
    messages.push({
      tool_call_id: toolCall.id,
      role: "tool",
      content: await callFunction(name, toolCall.function.arguments),
    });
    if (name === "done") {
      isDone = true;
    }
  }

  if (!isDone) {
    if (attemptsLeft === 0) {
      throw new Error("Max attempts reached");
    }
    await callChatGPT(messages, attemptsLeft - 1);
  }
};

const callFunction = async (name: string, parameters: string) => {
  const params = JSON.parse(parameters);
  try {
    const command = functions.find((f) => f.definition.function.name === name);
    if (!command) {
      throw new Error(`Function ${name} not found`);
    }
    return (await command.handler(params)) || "Done";
  } catch (error) {
    return `Error while calling function ${name}: ${error}`;
  }
};

const main = async () => {
  const app = process.argv[2];
  const task = process.argv[3];

  const rootDir = path.resolve(__dirname, "..", "..", "..");

  const setupPrompt = `
    You are the profession senior programming agent.
    Use provided tools to make changes to the codebase.
    Do not explain anything to me, just give me the best TypeScript code. 
    The code should be logically split into files following domain driven design DDD and clean architecture.
    The code should be properly formatted and should be able to run without any errors.
    Write the code in a way that it is easy to understand.
    Pay attention to the naming of variables and functions.
    Think on implementation step by step. 
    Use best practices. Keep the code simple and clean.
    Implement necessary unit and end-to-end test. Make sure to keep the changes minimal.
    Follow the code style and structure of the existing code. 
    Use proper types instead of "any" if possible.
    Use enums instead strings and booleans.
    Use early returns to reduce the nesting and complexity of the code. Dont use "else" keyword if possible.
    Use async/await instead of promises or callbacks.     
    Include changes in all files that are needed to implement working solution.
    Create tests for all branches.
    FYI jest expect(...).rejects.toThrow(..) doesn't work use rejects.toBeInstanceOf(...) instead.
   
    Do not change the existing tests.
    When you are done, run "npm test --selectProjects ${app}" to check if the code is working.
    If no errors are found, you can submit the code for review by calling function "done".
    `;
  const fileContent = await concatenateFiles(rootDir, app);
  const appReadmePath = path.resolve(rootDir, "src", "apps", app, "README.md");
  const readme =
    (await exists(appReadmePath)) && (await fs.readFile(appReadmePath, "utf8"));
  const packageJson = await fs.readFile(
    path.resolve(rootDir, "package.json"),
    "utf8"
  );

  const context = `
    You are working on the app: ${app}
    ${readme ? `This is the apps ${appReadmePath} : ${readme}` : ""}
    You would need to update this README.md file with the changes you made if needed.
    Do not change files outside of "src/apps/${app}" folder.
    This is the current list of files in the app that you can read or modify with functions:
    ${fileContent}
    Do not assume the content of the files, read the file you need for the context.
    You can run "npm" commands using "callNpm" tool function to build/test the code or add/remove packages.
    This is the current package.json file: ${packageJson}
    `;
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: setupPrompt,
      name: "setup",
    },
    { role: "system", content: fileContent, name: "content" },
    { role: "user", content: task, name: "user" },
  ];
  await callChatGPT(messages);
};

main();
