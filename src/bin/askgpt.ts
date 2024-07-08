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
        const { stdout, stderr} = await execAsync('npm test');
        console.log(stdout)
        return {testPass: true, errors: stderr};
    } catch (error: any) {
        return {testPass: false, errors: error.message};
    }
};


const concatenateFiles = async (rootDir: string): Promise<string> => {
    let concatenatedContent = '';

    const excludeDirs = ['node_modules', 'data', "bin"];
    const excludeFiles = ['package-lock.json', 'concatenated.ts'];

    const processDirectory = async (dir: string) => {
        const entries = await fs.readdir(dir, {withFileTypes: true});
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            const relativePath = path.relative(rootDir, fullPath);

            if (entry.isDirectory()) {
                if (!excludeDirs.includes(entry.name)) {
                    await processDirectory(fullPath);
                }
            } else if (entry.isFile()) {
                if (!excludeFiles.includes(entry.name) && /\.(ts|yaml|json)$/.test(entry.name)) {
                    const fileContent = await fs.readFile(fullPath, 'utf8');
                    concatenatedContent += `// File: ${relativePath}\n${fileContent}\n`;
                }
            }
        }
    };

    await processDirectory(rootDir);
    return concatenatedContent;
};


// Function to call ChatGPT API
const callChatGPT = async (messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]): Promise<any> => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_KEY
    });

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            response_format: {type: "json_object"},
            seed: 927364,
            temperature: 0.1,
            top_p: 1,
            messages
        })
        console.log(completion.choices[0])
        return completion;
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

const processAnswer = (result: any) => {
    const response = JSON.parse(result.choices[0].message.content)
    const finish = result.choices[0].finish_reason;
    if (!response.files) {
        throw new Error('No files found in response');
    }
    response.files.forEach(async (file: any) => {
        switch (file.operation) {
            case 'create':
                if (await exists(file.name)) {
                    throw new Error(`File "${file.name}" already exists`);
                }
                return await fs.writeFile(file.name, file.content);

            case 'update':
                if (!await exists(file.name)) {
                    throw new Error(`File "${file.name}" does not exist`);
                }
                return await fs.writeFile(file.name, file.content);

            case 'delete':
                if (!await exists(file.name)) {
                    throw new Error(`File "${file.name}" does not exist`);
                }
                return await fs.unlink(file.name);
            default:
                throw new Error(`Invalid operation "${file.operation}" for file "${file.name}"`);
        }
    });
};

const main = async () => {
    const setupPrompt = `
    Do not explain anything to me, just give me the TypeScript code. 
    The code should be logically split into files following clean architecture.
    the code should be properly formatted and should be able to run without any errors.
    Write the code in a way that it is easy to understand.
    Pay attention to the naming of variables and functions.
    Think on implementation step by step. Use best practices.
    Implement necessary unit and end-to-end test. Make sure to keep the changes minimal.
    Follow the code style and structure of the existing code. Include changes in all files that are needed to implement working solution and include tests for all code path
    Pack results as a json with key "files" containing array of object where each object contains fields:
    - "name" is the file path with name and extension.
    - "content" is the content of the file.
    - "operation" is what change need to be done on that file, one of "create", "update", "delete".    
    `

    const task = process.argv[2];

    try {
        const rootDir = path.resolve(__dirname, '..', '..');
        const fileContent = await concatenateFiles(rootDir)
        const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
            {role: 'system', content: setupPrompt, name:"setup"},
            {role: 'system', content: fileContent, name:"content"},
            {role: 'user', content: task, name: "user"}
        ]
        let testPass = false
        let retryCount = 5
        do {
            const chatGPTResponse = await callChatGPT(messages);
            processAnswer(chatGPTResponse);
            const testResults =  await runTests();
            testPass = testResults.testPass;
            retryCount--;
            console.log(testResults.errors)
            console.log("retryCount", retryCount)
            if(testResults.errors) {
                messages.push({
                    role: "assistant",
                    name: "assistant",
                    content: chatGPTResponse.choices[0].message.content
                })
                messages.push({
                    role: "user",
                    name: "user",
                    content: `There is an error while i was running "npm test". 
                    Fix it providing new version of files. Use JSON format as in initial prompt. Errors: ${testResults.errors}`
                })
            }
        } while (!testPass && retryCount);

    } catch (error: any) {
        console.error('Error:', error.message);
    }
};

main();
