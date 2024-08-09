import "dotenv/config";

/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./jest.setup.ts"],
};

module.exports = config;
