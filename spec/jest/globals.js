/* eslint-env jest */
global.InitializedZAFClient = {
  invoke: jest.fn()
}
global.ZAFClient = {
  init: () => global.InitializedZAFClient
}
