module.exports = {
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/tests/**/*.test.js'
  ],
  setupFilesAfterEnv: ['./jest.setup.js'],
  testTimeout: 30000,
  forceExit: true,
  detectOpenHandles: true
};
