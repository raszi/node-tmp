module.exports = {
  preset: 'ts-jest',
  testMatch: ['<rootDir>/test/**/*TestSuite.ts'],
  collectCoverage: true,
  verbose: true,
  collectCoverageFrom: [ '<rootDir>/src/*/*.ts' ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  }
};
