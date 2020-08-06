import React, { useState, useEffect } from 'react'
import { Grid, Row, Col } from '@zendeskgarden/react-grid'

import I18n from '../lib/i18n'
import ZendeskClient from '../lib/zendeskclient'
import ExceptionNotification from './components/exceptionnotification'
import OrderNumberInputForm from './components/ordernumberinput'
import OrderStatus from './components/orderstatus'

const TrackingStatus = ({
  userId,
  orderNumberTicketFieldId,
  displayCourierIcon
}) => {
  const [loading, setLoading] = useState(true)
  const [showOrderNumberInput, setShowOrderNumberInput] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [orderStatus, setOrderStatus] = useState()
  const [exception, setException] = useState()

  useEffect(() => { attemptAutoFetchOrderStatus() }, [])
  useEffect(() => { ZendeskClient.resizeContainer() })

  const resetFetchedOrderStatus = exception => {
    setLoading(false)
    setShowOrderNumberInput(true)
    setOrderStatus(undefined)
    setException(exception)
  }

  const attemptAutoFetchOrderStatus = async () => {
    if (orderNumberTicketFieldId) {
      try {
        const orderNumber = await ZendeskClient.getValueFromCustomTicketField(orderNumberTicketFieldId)
        if (orderNumber) {
          fetchOrderStatus(orderNumber)
        } else {
          resetFetchedOrderStatus()
        }
      } catch (error) {
        resetFetchedOrderStatus({
          type: 'warning',
          message: I18n.t('trackingStatus.warning.invalidOrderNumberTicketFieldId.message')
        })
      }
    } else {
      resetFetchedOrderStatus()
    }
  }

  const updateOrderNumber = event => {
    setOrderNumber(event.target.value)
  }

  const fetchOrderStatus = async orderNumber => {
    try {
      const response = await ZendeskClient.fetchCheckpoints(userId, orderNumber)
      const orderStatus = processCheckpointsResponse(response)

      setLoading(false)
      setOrderStatus(orderStatus)
      setException(undefined)
    } catch (error) {
      resetFetchedOrderStatus({
        type: 'error',
        message: error.status >= 500 ? I18n.t('trackingStatus.error.fetch.serverError', { statusCode: error.status }) : I18n.t('trackingStatus.error.fetch.badRequest')
      })
    }
  }

  const processCheckpointsResponse = response => response.header.map(headerEntry => ({
    trackingNumber: headerEntry.tracking_number,
    courier: {
      name: headerEntry.courier.name,
      prettyName: headerEntry.courier.prettyname
    },
    status: {
      message: headerEntry.last_delivery_status.status,
      timestamp: getMostRecentTimestampForTrackingNumber(response.body, headerEntry.id)
    }
  }))

  const getMostRecentTimestampForTrackingNumber = (body, checkpointId) => {
    const bodyEntriesOfCheckpoint = body[checkpointId]
    const mostRecentTimestamp = new Date(Math.max.apply(null, bodyEntriesOfCheckpoint
      .map(bodyEntry => new Date(bodyEntry.timestamp))))
    return mostRecentTimestamp
  }

  const submitForm = event => {
    event.preventDefault()
    setLoading(true)
    fetchOrderStatus(orderNumber)
  }

  return (
    <>
      <Grid>
        <Row>
          <Col>
            {showOrderNumberInput && <OrderNumberInputForm disabled={loading} orderNumber={orderNumber} onOrderNumberChange={updateOrderNumber} onSubmit={submitForm} />}
          </Col>
        </Row>
        {!loading && !exception && orderStatus && (
          <Row>
            <Col>
              <OrderStatus orderStatus={orderStatus} displayCourierIcon={displayCourierIcon} />
            </Col>
          </Row>
        )}
        {!loading && exception && (
          <Row>
            <Col style={{ marginTop: '50px' }}>
              <ExceptionNotification exception={exception} onClose={() => this.setState({ exception: undefined })} />
            </Col>
          </Row>
        )}
      </Grid>
      {!showOrderNumberInput && loading && <img className='loader centered' src='spinner.gif' />}
    </>
  )
}

export default TrackingStatus
