import { promisify } from 'util';
import { exec } from 'child_process';
import fs from 'fs/promises';
import { glob } from 'glob';

export const execAsync = promisify(exec);

export const run = async (command: string) => {
  try {
    const { stdout, stderr } = await execAsync(command);
    console.log(stdout);
    return { testPass: true, errors: stderr };
  } catch (error: any) {
    return { testPass: false, errors: error.message };
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

export const concatenateFiles = async (
  rootDir: string,
  app: string,
): Promise<string> =>
  (
    await Promise.all(
      [
        ...(await glob(rootDir + '/**/*', {
          ignore: [
            'docker-compose.yml',
            'src/shared/api.html',
            'coverage/**',
            'node_modules/**',
            'data/**',
            'src/apps/**',
            'package-lock.json',
            'concatenated.ts',
            'LICENSE',
            'README.md',
            '*.ico',
          ],
          matchBase: true,
          nodir: true,
          realpath: true,
          absolute: false,
        })),
        ...(await glob(`${rootDir}/src/apps/${app}/**`, {
          matchBase: true,
          nodir: true,
          realpath: true,
          absolute: false,
        })),
      ].map((file) =>
        fs
          .readFile(file, 'utf8')
          .then((content) => `// File: ${file}\n${content}\n`),
      ),
    )
  ).join('');
