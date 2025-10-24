module.exports = {
    transform: {
        '^.+\\.(ts|tsx)$': 'babel-jest',
    },
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testMatch: ['**/?(*.)+(test).+(ts|tsx|js)'],
};