module.exports = {
  rootDir: '.',
  preset: 'ts-jest',
  testMatch: ['**/test/**/*TestSuite.ts'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts'
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/.*[.]d[.]ts'
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  }
};