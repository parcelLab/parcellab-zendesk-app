/* global ZAFClient */

const zafClient = ZAFClient.init()

export const resizeContainer = (max = Number.POSITIVE_INFINITY) => {
  const newHeight = Math.min(document.body.clientHeight, max)
  return zafClient.invoke('resize', { height: newHeight })
}

export const get = (queryString) => {
  return zafClient.get(queryString)
}

export const metadata = () => {
  return zafClient.metadata()
}

export const fetchCheckpointsHeaders = (userId, orderNumber) => {
  const request = {
    url: `https://api.parcellab.com/v2/checkpoints?u=${userId}&orderNo=${orderNumber}`,
    type: 'GET',
    cors: true
  }
  return zafClient.request(request)
}
