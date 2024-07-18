import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  projects: [
    {
      displayName: 'task_manager',
      rootDir: './src/apps/task_manager',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/**/*.test.tsx'],
      maxWorkers: 1,
      forceExit: true,
      detectOpenHandles: true,
      collectCoverage: true,
      collectCoverageFrom: ['<rootDir>/**/*.ts'],
    },
    {
      displayName: 'task_manager_ui',
      rootDir: './src/apps/task_manager_ui',
      testEnvironment: '<rootDir>/JestTestEnv',
      testMatch: ['<rootDir>/**/*.test.tsx'],
      preset: 'ts-jest',
      maxWorkers: 1,
      forceExit: true,
      detectOpenHandles: true,
      collectCoverage: true,
      collectCoverageFrom: ['<rootDir>/**/*.ts'],

    },
    {
      displayName: 'shared',
      rootDir: './src/shared',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/**/*.test.tsx'],
      maxWorkers: 1,
      forceExit: true,
      detectOpenHandles: true,
      collectCoverage: true,
      collectCoverageFrom: ['<rootDir>/**/*.ts'],
    },
  ],
};
