import "dotenv/config";
import { JestConfigWithTsJest } from "ts-jest";
/** @type {import('ts-jest').JestConfigWithTsJest} */
const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  testMatch: ["<rootDir>/**/*.e2e.ts"],
  maxWorkers: 1,
  testTimeout: 30000,
  forceExit: true,
};

module.exports = config;
