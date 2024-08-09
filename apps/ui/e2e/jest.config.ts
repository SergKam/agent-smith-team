import "dotenv/config";
/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  preset: 'ts-jest',
  testMatch: ["<rootDir>/**/*.e2e.ts"],
  maxWorkers: 1,
};

module.exports = config;
