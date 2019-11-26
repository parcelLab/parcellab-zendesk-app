import React from 'react'
import { Grid, Row, Col } from '@zendeskgarden/react-grid'

import I18n from '../lib/i18n'
import ZendeskClient from '../lib/zendeskclient'
import ExceptionNotification from './components/exceptionnotification'
import OrderNumberInputForm from './components/ordernumberinput'
import OrderStatus from './components/orderstatus'

class TrackingStatus extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: true,
      showOrderNumberInput: false,
      orderNumber: '',
      orderStatus: undefined,
      exception: undefined
    }
    this.updateOrderNumber = this.updateOrderNumber.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.attemptAutoFetchOrderStatus = this.attemptAutoFetchOrderStatus.bind(this)
    this.fetchOrderStatus = this.fetchOrderStatus.bind(this)
    this.resetFetchedOrderStatus = this.resetFetchedOrderStatus.bind(this)
  }

  componentDidMount () {
    this.attemptAutoFetchOrderStatus()
  }

  componentDidUpdate () {
    ZendeskClient.resizeContainer()
  }

  resetFetchedOrderStatus (exception) {
    this.setState({
      loading: false,
      showOrderNumberInput: true,
      orderStatus: undefined,
      exception: exception
    })
  }

  async attemptAutoFetchOrderStatus () {
    if (this.props.orderNumberTicketFieldId) {
      try {
        const orderNumber = await ZendeskClient.getValueFromCustomTicketField(this.props.orderNumberTicketFieldId)
        if (orderNumber) {
          this.fetchOrderStatus(orderNumber)
        } else {
          this.resetFetchedOrderStatus()
        }
      } catch (error) {
        this.resetFetchedOrderStatus({
          type: 'warning',
          message: I18n.t('trackingStatus.warning.invalidOrderNumberTicketFieldId.message')
        })
      }
    } else {
      this.resetFetchedOrderStatus()
    }
  }

  updateOrderNumber (event) {
    this.setState({orderNumber: event.target.value})
  }

  async fetchOrderStatus (orderNumber) {
    try {
      const userId = this.props.userId
      const response = await ZendeskClient.fetchCheckpoints(userId, orderNumber)
      const orderStatus = this.processCheckpointsResponse(response)

      this.setState({
        loading: false,
        orderStatus,
        exception: undefined
      })
    } catch (error) {
      this.resetFetchedOrderStatus({
        type: 'error',
        message: error.status >= 500 ? I18n.t('trackingStatus.error.fetch.serverError', {statusCode: error.status}) : I18n.t('trackingStatus.error.fetch.badRequest')
      })
    }
  }

  processCheckpointsResponse (response) {
    return response.header.map(headerEntry => ({
      trackingNumber: headerEntry.tracking_number,
      courierName: headerEntry.courier.name,
      status: {
        message: headerEntry.last_delivery_status.status,
        timestamp: this.getMostRecentTimestampForTrackingNumber(response.body, headerEntry.id)
      }
    }))
  }

  getMostRecentTimestampForTrackingNumber (body, checkpointId) {
    const bodyEntriesOfCheckpoint = body[checkpointId]
    const mostRecentTimestamp = new Date(Math.max.apply(null, bodyEntriesOfCheckpoint
      .map(bodyEntry => new Date(bodyEntry.timestamp))))
    return mostRecentTimestamp
  }

  async submitForm (event) {
    this.setState({
      loading: true
    })
    event.preventDefault()
    this.fetchOrderStatus(this.state.orderNumber)
  }

  render () {
    return <React.Fragment>
      <Grid>
        <Row>
          <Col>
            {this.state.showOrderNumberInput && <OrderNumberInputForm disabled={this.state.loading} orderNumber={this.state.orderNumber} onOrderNumberChange={this.updateOrderNumber} onSubmit={this.submitForm} />}
          </Col>
        </Row>
        { !this.state.loading && !this.state.exception && this.state.orderStatus &&
          <Row>
            <Col>
              <OrderStatus orderStatus={this.state.orderStatus} />
            </Col>
          </Row>}
        {!this.state.loading && this.state.exception &&
          <Row>
            <Col style={{marginTop: '50px'}}>
              <ExceptionNotification exception={this.state.exception} onClose={() => this.setState({exception: undefined})} />
            </Col>
          </Row>}
      </Grid>
      {!this.state.showOrderNumberInput && this.state.loading && <img className='loader centered' src='spinner.gif' />}
    </React.Fragment>
  }
}

export default TrackingStatus
