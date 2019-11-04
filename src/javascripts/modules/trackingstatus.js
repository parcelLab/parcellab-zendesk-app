import React from 'react'
import { Button } from '@zendeskgarden/react-buttons'
import { Field, Label, Hint, Input } from '@zendeskgarden/react-forms'
import { Grid, Row, Col } from '@zendeskgarden/react-grid'
import { XL, LG } from '@zendeskgarden/react-typography'
import {
  Table,
  Caption,
  Head,
  HeaderRow,
  HeaderCell,
  Body,
  Row as TableRow,
  Cell
} from '@zendeskgarden/react-tables'
import { Alert, Close, Title } from '@zendeskgarden/react-notifications'

import I18n from '../lib/i18n'
import zafClient from '../lib/zafClient'
import {resizeContainer} from '../lib/helpers'

class TrackingStatus extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      showOrderNumberInput: false,
      orderNumber: '',
      orderHeaders: undefined,
      error: undefined
    }
    this.updateOrderNumber = this.updateOrderNumber.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.fetchOrderStatus = this.fetchOrderStatus.bind(this)
  }

  componentDidUpdate () {
    resizeContainer(zafClient)
  }
  async componentDidMount () {
    resizeContainer(zafClient)

    try {
      const userId = (await zafClient.metadata()).settings.userId
      const orderNumberTicketFieldId = (await zafClient.metadata()).settings.orderNumberTicketFieldId
      const queryString = `ticket.customField:custom_field_${orderNumberTicketFieldId}`
      const orderNumberTicketFieldValue = await zafClient.get(queryString)
      const orderNumber = orderNumberTicketFieldValue ? orderNumberTicketFieldValue[queryString] : undefined
      const response = await this.fetchCheckpointsHeaders(userId, orderNumber)
      this.setState({
        orderHeaders: response.header,
        error: undefined
      })
    } catch (e) {
      this.setState({
        showOrderNumberInput: true,
        orderHeader: [],
        error: I18n.t('trackingStatus.error.automaticFetch.message')
      })
    }
  }

  updateOrderNumber (event) {
    this.setState({orderNumber: event.target.value})
  }

  async fetchOrderStatus (orderNumber) {
    try {
      const userId = (await zafClient.metadata()).settings.userId
      const response = await this.fetchCheckpointsHeaders(userId, orderNumber)
      this.setState({
        orderHeaders: response.header,
        error: undefined
      })
    } catch (error) {
      this.setState({
        orderHeader: [],
        error: I18n.t('trackingStatus.error.manualFetch.message')
      })
    }
  }

  async fetchCheckpointsHeaders (userId, orderNumber) {
    const request = {
      url: `https://api.parcellab.com/v2/checkpoints?u=${userId}&orderNo=${orderNumber}`,
      type: 'GET',
      cors: true
    }
    return zafClient.request(request)
  }

  async submitForm (event) {
    event.preventDefault()
    this.fetchOrderStatus(this.state.orderNumber)
  }

  render () {
    const currentUser = this.props.currentUser
    return <div>
      <form onSubmit={this.submitForm}>
        <Grid>
          {this.state.showOrderNumberInput &&
          <React.Fragment>
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
                <Button disabled={this.state.orderNumber.length === 0} stretched type='submit'>{I18n.t('trackingStatus.checkButton')}</Button>
              </Col>
            </Row>
          </React.Fragment>
          }
          {this.state.error && <Row>
            <Col md={12} style={{marginTop: '50px'}}>
              <Alert type='error'>
                <Title>{I18n.t('trackingStatus.error.title')}</Title>
                {this.state.error}
                <Close id='root' onClick={() => this.setState({error: undefined})} aria-label={I18n.t('trackingStatus.error.close-aria-label')} />
              </Alert>
            </Col>
          </Row>}
          { !this.state.error && this.state.orderHeaders &&
          <Row>
            <Col>
              <Table size='small' style={{marginTop: '50px'}}>
                <XL tag={Caption}>
                  {I18n.t('trackingStatus.orderStatus')}
                </XL>
                <Head>
                  <HeaderRow>
                    <HeaderCell width='50%'>{I18n.t('trackingStatus.trackingNumber')}</HeaderCell>
                    <HeaderCell width='50%'>{I18n.t('trackingStatus.deliveryStatus')}</HeaderCell>
                  </HeaderRow>
                </Head>
                <Body>
                  { this.state.orderHeaders.map((header, index) =>
                    <a key={index} style={{color: 'inherit', textDecoration: 'inherit'}} target='_blank' rel='noopener' href={`https://www.delivery-status.com/?courier=${header.courier.name}&trackingNo=${header.tracking_number}&lang=en`}>
                      <TableRow>
                        <Cell width='50'>{header.tracking_number}</Cell>
                        <Cell width='50%'>{header.last_delivery_status.status}</Cell>
                      </TableRow>
                    </a>
                  )}
                </Body>
              </Table>
            </Col>
          </Row>}
        </Grid>
      </form>
    </div>
  }
}

export default TrackingStatus
