/* eslint-env jest */
import {resizeContainer, get, metadata, fetchCheckpointsHeaders} from '../src/javascripts/lib/zafclienthelper'

describe('ZAFClientHelper', () => {
  describe('resizeContainer', () => {
    it('calls zafClient.invoke with correct parameters', () => {
      resizeContainer()
      expect(global.InitializedZAFClient.invoke).toHaveBeenCalledWith('resize', {height: 0})
    })
  })

  describe('metadata', () => {
    it('calls zafClient.matadata', () => {
      metadata()
      expect(global.InitializedZAFClient.metadata).toHaveBeenCalled()
    })
  })

  describe('get', () => {
    it('calls zafClient.get with correct parameter', () => {
      const param = 'param'
      get(param)
      expect(global.InitializedZAFClient.get).toHaveBeenCalledWith(param)
    })
  })

  describe('fetchCheckpointsHeaders', () => {
    it('calls zafClient.request with correct parameter', () => {
      const userId = 'userId'
      const orderNumber = 'orderNumber'
      fetchCheckpointsHeaders(userId, orderNumber)
      expect(global.InitializedZAFClient.request).toHaveBeenCalledWith({
        url: `https://api.parcellab.com/v2/checkpoints?u=${userId}&orderNo=${orderNumber}`,
        type: 'GET',
        cors: true
      })
    })
  })
})
