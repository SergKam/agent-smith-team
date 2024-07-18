import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  forceExit: true,
  detectOpenHandles: true,
  maxConcurrency: 1,
  maxWorkers: 1,
  projects: [
    {
      displayName: 'task_manager',
      rootDir: './src/apps/task_manager',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/**/*.test.ts'],
      collectCoverageFrom: ['<rootDir>/**/*.ts'],
    },
    {
      displayName: 'task_manager_ui',
      rootDir: './src/apps/task_manager_ui',
      testEnvironment: '<rootDir>/JestTestEnv',
      testMatch: ['<rootDir>/**/*.test.{tsx, ts}'],
      preset: 'ts-jest',
      maxWorkers: 1,
      detectOpenHandles: true,
      collectCoverageFrom: ['<rootDir>/**/*.{tsx, ts}'],
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
