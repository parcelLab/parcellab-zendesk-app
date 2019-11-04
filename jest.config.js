module.exports = {
  verbose: true,
  testURL: 'http://localhost/',
  collectCoverage: true,
  globals: {
    ZAFClient: {
      init: () => {}
    }
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/spec'
  ],
  roots: ['./spec'],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/spec/mocks/emptyModule.js'
  }
}
