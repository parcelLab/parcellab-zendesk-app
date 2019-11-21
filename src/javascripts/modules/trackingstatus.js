import React from 'react'
import { Grid, Row, Col } from '@zendeskgarden/react-grid'

import I18n from '../lib/i18n'
import {resizeContainer, getValueFromCustomTicketField, fetchCheckpointsHeaders} from '../lib/zafclienthelper'
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
      orderHeader: undefined,
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
    resizeContainer()
  }

  resetFetchedOrderStatus (exception) {
    this.setState({
      loading: false,
      showOrderNumberInput: true,
      orderHeader: undefined,
      exception: exception
    })
  }

  async attemptAutoFetchOrderStatus () {
    if (this.props.orderNumberTicketFieldId) {
      try {
        const orderNumber = await getValueFromCustomTicketField(this.props.orderNumberTicketFieldId)
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
      const response = await fetchCheckpointsHeaders(userId, orderNumber)
      this.setState({
        loading: false,
        orderHeader: response.header,
        exception: undefined
      })
    } catch (error) {
      this.resetFetchedOrderStatus({
        type: 'error',
        message: error.status >= 500 ? I18n.t('trackingStatus.error.fetch.serverError', {statusCode: error.status}) : I18n.t('trackingStatus.error.fetch.badRequest')
      })
    }
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
        { !this.state.loading && !this.state.exception && this.state.orderHeader &&
          <Row>
            <Col>
              <OrderStatus orderHeader={this.state.orderHeader} />
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
