import "dotenv/config";
/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {

  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
};

module.exports = config;
