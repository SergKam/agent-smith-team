import path from "path";
import "dotenv/config";

import { concatenateFiles, exists } from "./lib/fileUtils";
import { generateText } from 'ai';
import fs from "fs/promises";
import { registry } from './lib/registry';
import * as tools from './tools'

const main = async () => {
  const app = process.argv[2];
  const prompt = process.argv[3];

  const rootDir = path.resolve(__dirname, "..", "..", "..");

  const setupPrompt = `
    You are the professional senior programming agent.
    Do not explain anything to me, just write the best TypeScript code.
    If the task is ambiguous or not well defined ask for details.
    Use provided tools to make changes to the codebase.  
    Make sure to keep the changes minimal. Prefer patchFile over writeFile.
    Read the content of the files before you make changes. Read multiple files using parallel_tool_calls.
    Read similar files to understand the context and existing practices.
    Keep files small and focused on a single task. Split the code into multiple files if needed.
    Do not explain anything to me, just give me the best TypeScript code. 
    The code should be logically split into files following domain driven design DDD and clean architecture.
    The code should be properly formatted and should be able to run without any errors.
    Write the code in a way that it is easy to understand.
    Pay attention to the naming of variables and functions.
    Think on implementation step by step. 
    Use best practices. Keep the code simple and clean.
    Implement necessary unit and end-to-end test. 
    Follow the code style and structure of the existing code. 
    Use proper types instead of "any" if possible.
    Use enums instead strings and booleans.
    Use early returns to reduce the nesting and complexity of the code. Dont use "else" keyword if possible.
    Use async/await instead of promises or callbacks.     
    Include changes in all files that are needed to implement working solution.
    Create tests for all branches.
    Do not change the existing tests.
    When you are done, run "npm test --selectProjects ${app}" to check if the code is working.
    If no errors are found, you can finish and answer with the short git commit message 
    with the summary of the changes made.
    `;
  const fileContent = await concatenateFiles(rootDir, app);
  const appReadmePath = path.resolve(rootDir, "src", "apps", app, "README.md");
  const readme =
    (await exists(appReadmePath)) && (await fs.readFile(appReadmePath, "utf8"));
  const packageJson = await fs.readFile(
    path.resolve(rootDir, "package.json"),
    "utf8"
  );

  const system = `
    ${setupPrompt}
    You are working on the app: ${app}
    ${readme ? `This is the apps ${appReadmePath} : ${readme}` : ""}
    Follow the readme. You would need to update this README.md file with the changes you made if needed.
    Do not change files outside of "src/apps/${app}" folder.
    This is the current list of files in the app that you can read or modify with functions:
    ${fileContent}
    Do not assume the content of the files, read the file you need for the context.
    You can run "npm" commands using "callNpm" tool function to build/test the code or add/remove packages.
    This is the current package.json file: ${packageJson}
    `;


  const result = await generateText({
    model: registry.languageModel(process.env.AI_MODEL || "openai:gpt-4o"),
    seed: 927364,
    temperature: 0,
    maxToolRoundtrips: 100,
    tools,
    system,
    prompt
  })

  console.dir("text", result.text)
  console.log("finish", result.finishReason)
  console.log("usage", result.usage)
  console.log("roundtrips", result.roundtrips)
};

main().catch(console.error);
