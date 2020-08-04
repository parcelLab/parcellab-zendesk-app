/* global ZAFClient APP_VERSION */
const zafClient = ZAFClient.init()

class ZendeskClient {
  constructor (stripLeadingZerosFromOrderNumber = false) {
    this.stripLeadingZerosFromOrderNumber = stripLeadingZerosFromOrderNumber
  }

  resizeContainer (max = Number.POSITIVE_INFINITY) {
    const newHeight = Math.min(document.body.clientHeight, max)
    return zafClient.invoke('resize', { height: newHeight })
  }

  fetchCheckpoints (userId, orderNumber) {
    const preprocessedOrderNumber = this.stripLeadingZerosFromOrderNumber ? orderNumber.replace(/^0*/, '') : orderNumber
    const request = {
      url: `https://api.parcellab.com/v2/checkpoints?u=${userId}&orderNo=${preprocessedOrderNumber}`,
      type: 'GET',
      cors: true,
      headers: {
        'User-Agent': `parcelLab-ZenDesk-App/${APP_VERSION}`
      }
    }
    return zafClient.request(request)
  }

  onAppRegistered (callback) {
    zafClient.on('app.registered', callback)
  }

  setStripLeadingZerosFromOrderNumber (stripLeadingZerosFromOrderNumber) {
    this.stripLeadingZerosFromOrderNumber = stripLeadingZerosFromOrderNumber
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
