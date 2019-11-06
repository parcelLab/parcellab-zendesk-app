module.exports = {
  verbose: true,
  testURL: 'http://localhost/',
  collectCoverage: true,
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
