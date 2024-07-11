/** @type {import('ts-jest').JestConfigWithTsJest} */

import dotenv from 'dotenv';

dotenv.config({path: '.env.test'});

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    maxWorkers: 1,
    forceExit: true,
    detectOpenHandles: true,
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts'],
};
