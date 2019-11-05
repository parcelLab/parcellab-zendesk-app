/* global ZAFClient */

const zafClient = ZAFClient.init()

export const resizeContainer = (max = Number.POSITIVE_INFINITY) => {
  const newHeight = Math.min(document.body.clientHeight, max)
  return zafClient.invoke('resize', { height: newHeight })
}

export const fetchCheckpointsHeaders = (userId, orderNumber) => {
  const request = {
    url: `https://api.parcellab.com/v2/checkpoints?u=${userId}&orderNo=${orderNumber}`,
    type: 'GET',
    cors: true
  }
  return zafClient.request(request)
}

export const onAppRegistered = (callback) => {
  zafClient.on('app.registered', callback)
}

export const getCurrentUserDetails = async () => {
  return (await zafClient.get('currentUser')).currentUser
}

export const getAppSettings = async () => {
  return (await zafClient.metadata()).settings
}

export const getValueFromCustomTicketField = async (customTicketFieldId) => {
  const queryString = `ticket.customField:custom_field_${customTicketFieldId}`
  const orderNumberTicketFieldValue = await zafClient.get(queryString)
  if (queryString in orderNumberTicketFieldValue) {
    return orderNumberTicketFieldValue[queryString]
  } else {
    throw new Error(`Unable to get ticket field value from field: ${customTicketFieldId}`)
  }
}
