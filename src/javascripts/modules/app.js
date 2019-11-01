import React from 'react'
import ReactDOM from 'react-dom'

import { ThemeProvider } from '@zendeskgarden/react-theming'

import TrackingStatus from './trackingstatus'
import I18n from '../../javascripts/lib/i18n'
import zafClient from '../lib/zafClient'

const App = appData => {
  zafClient.get('currentUser').then(({ currentUser }) => {
    I18n.loadTranslations(currentUser.locale)
    ReactDOM.render(
      <ThemeProvider>
        <TrackingStatus currentUser={currentUser.name} />
      </ThemeProvider>,
      document.getElementById('root')
    )
  })
}

export default App
