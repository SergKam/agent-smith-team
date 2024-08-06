import "dotenv/config";
/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  preset: 'jest-puppeteer',
  testMatch: ["<rootDir>/**/*.e2e.ts"],
};

module.exports = config;
