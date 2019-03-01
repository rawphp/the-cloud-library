module.exports = {
  bail: true,
  verbose: true,
  transform: {
    '.(ts|tsx)': 'ts-jest/preprocessor.js',
  },
  testMatch: ['**/*.(spec|test).ts'],
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  coverageDirectory: '.coverage',
  coverageReporters: ['text', 'text-summary'],
  coverageThreshold: {
    global: {
      statements: 76,
      lines: 80,
      functions: 72,
    },
  },
  testPathIgnorePatterns: ['/dist/', '/.coverage/', '/node_modules/'],
};
