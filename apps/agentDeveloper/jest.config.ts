import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  forceExit: true,
  detectOpenHandles: true,
  maxConcurrency: 1,
  maxWorkers: 1,
  testEnvironment: "node",
  testMatch: ["<rootDir>/**/*.test.ts"],
  collectCoverageFrom: ["<rootDir>/**/*.ts"],
}
