
import App from '../modules/app'
import client from '../lib/zafClient'

client.on('app.registered', appData => new App(appData))
