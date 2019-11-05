/* eslint-env jest */
global.InitializedZAFClient = {
  invoke: jest.fn(),
  metadata: jest.fn(),
  get: jest.fn(),
  request: jest.fn()
}
global.ZAFClient = {
  init: () => global.InitializedZAFClient
}
