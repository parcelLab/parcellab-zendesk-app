import App from '../modules/app'
import client from '../lib/zafClient'

client.on('app.registered', function (appData) {
  return new App(appData)
})
