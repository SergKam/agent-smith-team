import fs from 'fs/promises';
import path from 'path';
import dotenv from "dotenv";
import OpenAI from "openai";
import {exec} from 'child_process';
import {promisify} from 'util';

dotenv.config();

const execAsync = promisify(exec);

const runTests = async () => {
    try {
        const {stdout, stderr} = await execAsync('npm test');
        console.log(stdout)
        return {testPass: true, errors: stderr};
    } catch (error: any) {
        return {testPass: false, errors: error.message};
    }
};


const concatenateFiles = async (rootDir: string, app: string): Promise<string> => {
    let concatenatedContent = '';


    const processDirectory = async (dir: string, exclude: string[]) => {
        const entries = await fs.readdir(dir, {withFileTypes: true});
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            const relativePath = path.relative(rootDir, fullPath);
            if (exclude.includes(entry.name) || entry.name.startsWith('.')) {
                continue;
            }
            if (entry.isDirectory()) {
                await processDirectory(fullPath, exclude);
                continue;
            }
            if (entry.isFile()) {
                const fileContent = await fs.readFile(fullPath, 'utf8');
                concatenatedContent += `// File: ${relativePath}\n${fileContent}\n`;
                console.log(relativePath)
            }
        }
    };

    await processDirectory(rootDir, ['coverage', 'node_modules', 'data', 'apps', 'package-lock.json', 'concatenated.ts']);
    await processDirectory(path.join(rootDir, 'src', 'apps', app), []);
    return concatenatedContent;
};


const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});

const callChatGPT = async (messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]): Promise<any> => {
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o', response_format: {type: "json_object"}, seed: 927364, temperature: 0.1, top_p: 1, messages
        })

        console.log(completion.choices[0])
        messages.push({
            role: "assistant", name: "assistant", content: completion.choices[0].message.content
        })

        return completion.choices[0].message.content
    } catch (error: any) {
        throw new Error(`Error calling ChatGPT API: ${error.message}`);
    }
};

const exists = async (path: string) => {
    try {
        await fs.access(path);
        return true;
    } catch (error) {
        return false;
    }
}

const processCommand = async (command: string) => {
    const file = JSON.parse(command)

    switch (file.operation) {
        case 'create':
            if (await exists(file.name)) {
                console.warn(`File "${file.name}" already exists`);
            }

            const folders = path.dirname(file.name);
            await fs.mkdir(folders, {recursive: true});
            await fs.writeFile(file.name, file.content);
            break

        case 'update':
            if (!await exists(file.name)) {
                throw new Error(`File "${file.name}" does not exist`);
            }
            await fs.writeFile(file.name, file.content);
            break

        case 'delete':
            if (!await exists(file.name)) {
                throw new Error(`File "${file.name}" does not exist`);
            }
            await fs.unlink(file.name);
            break
        default:
            throw new Error(`Invalid operation "${file.operation}" for file "${file.name}"`);
    }
    return file.finished;
}


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
    For each file you want to create, update, or delete you create a separate answer one command a a time.
    I will confirm if you can proceed to the next step with the key word "continue".
    Each you answer should be in JSON format.
  
    Where each object contains fields:
    - "operation" is what change need to be done on that file, one of "create", "update", "delete".
    - "comment" is a string that explains the reason for the change.
    - "finished" is a boolean that indicates if you are done with the whole task.    
    - "name" is the file path with name and extension.
    - "content" is the content of the file.
    `
    const app = process.argv[2];
    const task = process.argv[3];

    try {
        const rootDir = path.resolve(__dirname, '..', '..', '..');
        const fileContent = await concatenateFiles(rootDir, app)
        const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [{
            role: 'system', content: setupPrompt, name: "setup"
        }, {role: 'system', content: fileContent, name: "content"}, {role: 'user', content: task, name: "user"}]
        let testPass = false
        let retryLeft = 5
        do {
            let finished = false
            do {
                const chatGPTResponse = await callChatGPT(messages);

                finished = await processCommand(chatGPTResponse);
                if (!finished) {
                    messages.push({
                        role: "user", name: "user", content: "continue"
                    })
                }
            } while (!finished);

            const testResults = await runTests();
            testPass = testResults.testPass;
            retryLeft--;
            console.log(testResults.errors)
            console.log("retryLeft", retryLeft)
            if (testResults.errors) {
                messages.push({
                    role: "user", name: "user", content: `There is an error while i was running "npm test". 
                    Fix it providing new version of files. Use JSON format as in initial prompt. Only change files
                    needed to fix the problem with tests.
                    Errors: ${testResults.errors}`
                })
            }
        } while (!testPass && retryLeft);

    } catch (error: any) {
        console.error('Error:', error.message);
    }
};

main();
