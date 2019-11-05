import React from 'react'
import ReactDOM from 'react-dom'

import { ThemeProvider } from '@zendeskgarden/react-theming'

import TrackingStatus from './trackingstatus'
import I18n from '../../javascripts/lib/i18n'
import {getCurrentUserDetails, getAppSettings} from '../lib/zafclienthelper'

const App = async appData => {
  const {locale} = await getCurrentUserDetails()
  const {userId, orderNumberTicketFieldId} = await getAppSettings()

  I18n.loadTranslations(locale)
  ReactDOM.render(
    <ThemeProvider>
      <TrackingStatus userId={userId} orderNumberTicketFieldId={orderNumberTicketFieldId} />
    </ThemeProvider>,
    document.getElementById('root')
  )
}

export default App
