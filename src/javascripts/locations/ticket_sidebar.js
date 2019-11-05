
import App from '../modules/app'
import client from '../lib/zafclienthelper'

client.on('app.registered', appData => new App(appData))
