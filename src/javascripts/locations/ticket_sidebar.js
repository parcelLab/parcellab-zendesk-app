import '@zendeskgarden/react-buttons/dist/styles.css'
import '@zendeskgarden/react-forms/dist/styles.css'
import '@zendeskgarden/react-grid/dist/styles.css'
import App from '../modules/app'
import client from '../lib/zafClient'

client.on('app.registered', function (appData) {
  return new App(appData)
})
