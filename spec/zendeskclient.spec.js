/* eslint-env jest */
import ZendeskClient from '../src/javascripts/lib/zendeskclient'

describe('ZendeskClient', () => {
  describe('resizeContainer', () => {
    it('calls zafClient.invoke with correct parameters', () => {
      ZendeskClient.resizeContainer()
      expect(global.InitializedZAFClient.invoke).toHaveBeenCalledWith('resize', {height: 0})
    })
  })

  describe('getCurrentUserDetails', () => {
    it('returns "currentUser" property from zafClient.get', async () => {
      const expectedValue = 'expectedValue'
      global.InitializedZAFClient.get = jest.fn().mockReturnValue(Promise.resolve({
        currentUser: expectedValue
      }))
      await expect(ZendeskClient.getCurrentUserDetails()).resolves.toBe('expectedValue')
      expect(global.InitializedZAFClient.get).toHaveBeenCalledWith('currentUser')
    })
  })

  describe('getAppSettings', () => {
    it('returns "settings" property from zafClient.metadata call', async () => {
      const expectedValue = 'expectedValue'
      global.InitializedZAFClient.metadata = jest.fn().mockReturnValue(Promise.resolve({
        settings: expectedValue
      }))
      await expect(ZendeskClient.getAppSettings()).resolves.toBe('expectedValue')
      expect(global.InitializedZAFClient.metadata).toHaveBeenCalled()
    })
  })

  describe('onAppRegistered', () => {
    it('calls zafClient.get with correct parameter', () => {
      const param = 'param'
      ZendeskClient.onAppRegistered(param)
      expect(global.InitializedZAFClient.on).toHaveBeenCalledWith('app.registered', param)
    })
  })

  describe('fetchCheckpointsHeaders', () => {
    it('calls zafClient.request with correct parameter', () => {
      const userId = 'userId'
      const orderNumber = 'orderNumber'
      ZendeskClient.fetchCheckpointsHeaders(userId, orderNumber)
      expect(global.InitializedZAFClient.request).toHaveBeenCalledWith({
        url: `https://api.parcellab.com/v2/checkpoints?u=${userId}&orderNo=${orderNumber}`,
        type: 'GET',
        cors: true
      })
    })
  })

  describe('getValueFromCustomTicketField', () => {
    it('gets value from custom ticket field', async () => {
      const customTicketFieldId = 'customTicketFieldId'
      const customTicketFieldFullName = `ticket.customField:custom_field_${customTicketFieldId}`
      const ticketValue = 'ticketValue'
      global.InitializedZAFClient.get = jest.fn().mockReturnValue(Promise.resolve({
        [customTicketFieldFullName]: ticketValue
      }))

      const actualValue = await ZendeskClient.getValueFromCustomTicketField(customTicketFieldId)

      expect(global.InitializedZAFClient.get)
        .toHaveBeenCalledWith(customTicketFieldFullName)
      expect(actualValue).toBe(ticketValue)
    })

    it('throws error if value cannot be retrieved from custom ticket field', async () => {
      const customTicketFieldId = 'customTicketFieldId'
      const customTicketFieldFullName = `ticket.customField:custom_field_${customTicketFieldId}`
      global.InitializedZAFClient.get = jest.fn().mockReturnValue(Promise.resolve({}))

      await expect(ZendeskClient.getValueFromCustomTicketField(customTicketFieldId)).rejects.toThrowError()

      expect(global.InitializedZAFClient.get)
        .toHaveBeenCalledWith(customTicketFieldFullName)
    })
  })
})
