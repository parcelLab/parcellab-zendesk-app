/* eslint-env jest */
import {resizeContainer} from '../src/javascripts/lib/zafclienthelper'

describe('ZAFClientHelper', () => {
  it('client.invoke has been called', () => {
    resizeContainer()
    expect(global.InitializedZAFClient.invoke).toHaveBeenCalled()
  })
})
