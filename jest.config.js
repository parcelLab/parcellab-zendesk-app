module.exports = {
  verbose: true,
  testURL: 'http://localhost/',
  collectCoverage: true,
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__mocks__/fileStub.js'
  },
  setupFiles: [
    '<rootDir>/spec/jest/globals.js'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/spec/jest/globalImports.js'
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/spec'
  ],
  roots: ['./spec']
}
