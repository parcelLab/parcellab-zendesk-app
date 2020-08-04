/* eslint-env jest */
global.InitializedZAFClient = {
  on: jest.fn(),
  invoke: jest.fn(),
  metadata: jest.fn(),
  get: jest.fn(),
  request: jest.fn()
}
global.ZAFClient = {
  init: () => global.InitializedZAFClient
}
global.APP_VERSION = '1.2.3-TEST'
