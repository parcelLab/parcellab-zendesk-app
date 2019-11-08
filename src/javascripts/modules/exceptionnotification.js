import React from 'react'
import { Alert, Close, Title } from '@zendeskgarden/react-notifications'

import I18n from '../lib/i18n'

const ExceptionNotification = ({exception, onClose}) => {
  return <Alert type={exception.type}>
    <Title>{I18n.t(`trackingStatus.${exception.type}.title`)}</Title>
    {exception.message}
    <Close id='root' onClick={() => onClose()} aria-label={I18n.t('trackingStatus.exception.close-aria-label')} />
  </Alert>
}

export default ExceptionNotification
