module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json'
        }
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    testMatch: ['**/src/**/*.test.(ts|tsx)'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    }
};
