import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  forceExit: true,
  detectOpenHandles: true,
  maxConcurrency: 1,
  maxWorkers: 1,
  retries: 0,
  projects: [
    {
      displayName: 'task_manager',
      rootDir: './src/apps/task_manager',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/**/*.test.ts'],
      collectCoverageFrom: ['<rootDir>/**/*.ts'],
    },
    {
      displayName: 'shared',
      rootDir: './src/shared',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/**/*.test.ts'],
      maxWorkers: 1,
      detectOpenHandles: true,
      collectCoverageFrom: ['<rootDir>/**/*.ts'],
    },
  ],
};
