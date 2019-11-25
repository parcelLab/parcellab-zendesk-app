import App from './javascripts/modules/app'
import ZendeskClient from './javascripts/lib/zendeskclient'

ZendeskClient.onAppRegistered(appData => new App(appData))
