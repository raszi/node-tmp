module.exports = {
  preset: 'ts-jest',
  testMatch: ['<rootDir>/test/**/*TestSuite.ts'],
  collectCoverage: true,
  verbose: true,
  collectCoverageFrom: [ '<rootDir>/src/*/*.ts' ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
