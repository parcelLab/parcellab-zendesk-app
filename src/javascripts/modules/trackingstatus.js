import React from 'react'
import { Button } from '@zendeskgarden/react-buttons'
import { Field, Label, Hint, Input } from '@zendeskgarden/react-forms'
import { Grid, Row, Col } from '@zendeskgarden/react-grid'
import { LG } from '@zendeskgarden/react-typography'

import I18n from '../lib/i18n'
import zafClient from '../lib/zafClient'
import {resizeContainer} from '../lib/helpers'

class TrackingStatus extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      orderNumber: '',
      orderHeaders: [],
      fetchError: undefined
    }
    this.updateOrderNumber = this.updateOrderNumber.bind(this)
    this.fetchCheckpoints = this.fetchCheckpoints.bind(this)
  }

  componentDidUpdate () {
    resizeContainer(zafClient)
  }
  componentDidMount () {
    resizeContainer(zafClient)
  }

  updateOrderNumber (event) {
    this.setState({orderNumber: event.target.value})
  }

  async fetchCheckpoints (event) {
    event.preventDefault()
    try {
      const userId = (await zafClient.metadata()).settings.userId
      const request = {
        url: `https://api.parcellab.com/v2/checkpoints?u=${userId}&orderNo=${this.state.orderNumber}`,
        type: 'GET',
        cors: true
      }

      const response = await zafClient.request(request)
      this.setState({
        orderHeaders: response.header,
        fetchError: undefined
      })
    } catch (error) {
      this.setState({
        orderHeader: [],
        fetchError: 'Order Number Cannot Be Found'
      })
    }
  }

  render () {
    const currentUser = this.props.currentUser
    return <div>
      <form onSubmit={this.fetchCheckpoints}>
        <Grid>
          <Row>
            <Col md={12}>
              <LG tag='h1'>
                {I18n.t('trackingStatus.greeting', {username: currentUser})}
              </LG>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Field stretched>
                <Label>{I18n.t('trackingStatus.orderNumber')}</Label>
                <Hint>{I18n.t('trackingStatus.orderNumberHint')}</Hint>
                <Input onChange={this.updateOrderNumber} value={this.state.orderNumber} />
              </Field>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Button stretched type='submit'>{I18n.t('trackingStatus.checkButton')}</Button>
            </Col>
          </Row>
          {this.state.fetchError && <Row>
            <Col md={12}>
              <LG>{this.state.fetchError}</LG>
            </Col>
          </Row>}
          { !this.state.fetchError && this.state.orderHeaders && this.state.orderHeaders.map(header => <Row key={header.tracking_number}>
            <Col md={6}>
              <LG>{I18n.t('trackingStatus.trackingNumber')}: {header.tracking_number}</LG>
            </Col>
            <Col md={6}>
              <LG>{I18n.t('trackingStatus.deliveryStatus')}: {header.last_delivery_status.status}</LG>
            </Col>
          </Row>)}
        </Grid>
      </form>
    </div>
  }
}

export default TrackingStatus
