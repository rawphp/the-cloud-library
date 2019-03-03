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
      statements: 60,
      lines: 60,
      functions: 60,
    },
  },
  testPathIgnorePatterns: ['/dist/', '/.coverage/', '/node_modules/'],
};
