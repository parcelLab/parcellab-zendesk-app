import React from 'react'
import ReactDOM from 'react-dom'

import { ThemeProvider } from '@zendeskgarden/react-theming'

import TrackingStatus from './trackingstatus'
import I18n from '../../javascripts/lib/i18n'
import zafClient from '../lib/zafClient'

const App = async appData => {
  const {currentUser: {name, locale}} = await zafClient.get('currentUser')
  const {settings: {userId, orderNumberTicketFieldId}} = await zafClient.metadata()

  I18n.loadTranslations(locale)
  ReactDOM.render(
    <ThemeProvider>
      <TrackingStatus currentUser={name} userId={userId} orderNumberTicketFieldId={orderNumberTicketFieldId} />
    </ThemeProvider>,
    document.getElementById('root')
  )
}

export default App
