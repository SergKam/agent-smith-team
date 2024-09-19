import { promisify } from "util";
import { exec } from "child_process";
import fs from "fs/promises";
import { glob } from "glob";

export const execAsync = promisify(exec);

export const run = async (command: string) => {
  try {
    const { stdout, stderr } = await execAsync(command);
    console.log(stdout);
    return { success: true, errors: stderr };
  } catch (error: any) {
    return { success: false, errors: error.message, stdout: error.stdout };
  }
};

export const exists = async (path: string) => {
  try {
    await fs.access(path);
    return true;
  } catch (error) {
    return false;
  }
};

export const listFiles = async (): Promise<string> =>
  (
    await glob(`./**`, {
      ignore: [
        "node_modules/**",
        "coverage/**",
        "dist/**",
        "build/**",
        "data/**",
      ],
      matchBase: true,
      nodir: true,
      realpath: true,
      absolute: false,
    })
  ).join("\n");
