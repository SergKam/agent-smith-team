import path from "path";
import "dotenv/config";

import { listFiles, exists } from "./lib/fileUtils";
import { generateText } from "ai";
import fs from "fs/promises";
import { registry } from "./lib/registry";
import * as tools from "./tools";

const main = async () => {
  const app = process.argv[2];
  const prompt = process.argv[3];

  const setupPrompt = `
    You are the professional senior programmer.
    Follow user instructions to complete the task.
    If the task is ambiguous or not well-defined ask for details.
    Use provided tools to make changes to the codebase.  
    Make sure to keep the changes minimal. Prefer patchFile over writeFile.
    Read the content of the files before you make changes. Read multiple files using parallel_tool_calls.
    Read similar files to understand the context and existing practices.
    Keep files small and focused on a single task. Split the code into multiple files if needed.
    Do not explain, just give me the best functional TypeScript code. 
    The code should be logically split into files following domain driven design DDD and clean architecture.
    The code should be properly formatted and should be able to run without any errors.
    Write the code in a way that it is easy to understand.
    Make variables and functions human readable .
    Think on implementation step by step. 
    Use best practices. Keep the code simple and clean.
    Implement necessary unit and end-to-end test. 
    Follow the code style and structure of the existing code. 
    Use proper types instead of "any" if possible.
    Use enums instead strings and booleans.
    Use early returns to reduce the nesting and complexity of the code. Dont use "else" keyword if possible.
    Use async/await instead of promises or callbacks.     
    Include changes in all files that are needed to implement working solution.
    Attention to import statements. Correct path. Remove unused imports.
    Create tests for all branches.
    When you are done, run "npm test" to check if the code is working.
    All Test MUST pass!
    If no errors are found, you can finish and answer with the short git commit message 
    with the summary of the changes made.
    `;

  const rootDir = path.resolve(__dirname, "..", app);
  process.chdir(rootDir);
  const fileContent = await listFiles();

  const readmeFile = "README.md";
  const readme =
    (await exists(readmeFile)) && (await fs.readFile(readmeFile, "utf8"));
  const packageJson = await fs.readFile("package.json", "utf8");

  const system = `
    ${setupPrompt}
    You are working on the app: ${app}
    This is the apps ${readmeFile} : 
    [file start]
    ${readme}
    [file end]
    Follow the readme. You would need to update this README.md file with the changes you made if needed.
    Do not change files outside of "src/apps/${app}" folder.
    This is the current list of files in the app that you can read or modify with functions:
    [list start]
    ${fileContent}
    [list end]
    Do not assume the content of the files, read the file you need for the context.
    You can run "npm" commands using "callNpm" tool function to build/test the code or add/remove packages.
    This is the current package.json file:
    [file start]
    ${packageJson}
    [file end]
    `;
  console.log(system);
  const result = await generateText({
    model: registry.languageModel(process.env.AI_MODEL || "openai:gpt-4o"),
    seed: 927364,
    temperature: 0,
    maxToolRoundtrips: 100,
    tools,
    system,
    prompt,
  });

  console.dir("text", result.text);
  console.log("finish", result.finishReason);
  console.log("usage", result.usage);
  console.dir("roundtrips", result.roundtrips);
};

main().catch(console.error);
