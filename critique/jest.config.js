const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

const customJestConfig = {
  transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/?(*.)+(test).+(ts|tsx|js)'],
}

module.exports = createJestConfig(customJestConfig)
