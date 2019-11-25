/* global ZAFClient */
const zafClient = ZAFClient.init()

class ZendeskClient {
  constructor (stripLeadingZeros = false) {
    this.stripLeadingZeros = stripLeadingZeros
  }

  resizeContainer (max = Number.POSITIVE_INFINITY) {
    const newHeight = Math.min(document.body.clientHeight, max)
    return zafClient.invoke('resize', { height: newHeight })
  }

  fetchCheckpointsHeaders (userId, orderNumber) {
    const request = {
      url: `https://api.parcellab.com/v2/checkpoints?u=${userId}&orderNo=${orderNumber}`,
      type: 'GET',
      cors: true
    }
    return zafClient.request(request)
  }

  onAppRegistered (callback) {
    zafClient.on('app.registered', callback)
  }

  async getCurrentUserDetails () {
    return (await zafClient.get('currentUser')).currentUser
  }

  async getAppSettings () {
    return (await zafClient.metadata()).settings
  }

  async getValueFromCustomTicketField (customTicketFieldId) {
    const queryString = `ticket.customField:custom_field_${customTicketFieldId}`
    const orderNumberTicketFieldValue = await zafClient.get(queryString)
    if (queryString in orderNumberTicketFieldValue) {
      return orderNumberTicketFieldValue[queryString]
    } else {
      throw new Error(`Unable to get ticket field value from field: ${customTicketFieldId}`)
    }
  }
}

export default new ZendeskClient()
