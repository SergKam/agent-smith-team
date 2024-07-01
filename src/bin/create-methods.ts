import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// Define the base directory for routes
const BASE_DIR = path.join(__dirname, '../src', 'api');

// Read the API definitions from the YAML file
const API_FILE = path.join(__dirname, '../api.yaml');

// Function to create directories and files for each endpoint
function createEndpointFiles(pathStr: string, method: string) {
    // Create the directory structure
    const dir = path.join(BASE_DIR, pathStr);
    fs.mkdirSync(dir, { recursive: true });

    // Create the file for the endpoint method
    const file = path.join(dir, `${method}.ts`);
    if (!fs.existsSync(file)) {
        const content = `
import { Request, Response } from 'express';

export default function() {
  return {
    ${method}: (req: Request, res: Response) => {
      res.send('Response from ${method.toUpperCase()} ${pathStr}');
    }
  };
}
`;
        fs.writeFileSync(file, content);
    }
}

// Parse the YAML file and create the endpoints
const api = yaml.load(fs.readFileSync(API_FILE, 'utf8')) as any;

for (const pathStr in api.paths) {
    for (const method in api.paths[pathStr]) {
        createEndpointFiles(pathStr, method);
    }
}

console.log("File structure for API methods created successfully.");
