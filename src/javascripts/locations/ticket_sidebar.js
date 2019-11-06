import App from '../modules/app'
import {onAppRegistered} from '../lib/zafclienthelper'

onAppRegistered(appData => new App(appData))
