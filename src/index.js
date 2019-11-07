import App from './javascripts/modules/app'
import {onAppRegistered} from './javascripts/lib/zafclienthelper'

onAppRegistered(appData => new App(appData))
