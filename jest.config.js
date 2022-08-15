/** jest.config.js */

module.exports = {
  collectCoverageFrom: [
    '<rootDir>/src/app/*.ts',
    '<rootDir>/src/app/**/*.ts',
  ],

  coverageDirectory: 'coverage',

  coverageReporters: [
    'lcov',
    'text-summary'
  ],

  testPathIgnorePatterns: [
    '<rootDir>/coverage/',
    '<rootDir>/dist/',
    '<rootDir>/e2e/',
    '<rootDir>/node_modules/'
  ],

  testMatch: [
    '<rootDir>/src/app/*.spec.ts',
    '<rootDir>/src/app/**/*.spec.ts'
  ]
};
