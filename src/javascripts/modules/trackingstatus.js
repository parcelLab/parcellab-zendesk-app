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
      exception: undefined
    }
    this.updateOrderNumber = this.updateOrderNumber.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.attemptAutoFetchOrderStatus = this.attemptAutoFetchOrderStatus.bind(this)
  }

  componentDidUpdate () {
    resizeContainer(zafClient)
  }

  async retrieveOrderNumberFromTicketField (ticketFieldId) {
    try {
      const queryString = `ticket.customField:custom_field_${ticketFieldId}`
      const orderNumberTicketFieldValue = await zafClient.get(queryString)
      if (queryString in orderNumberTicketFieldValue) {
        return orderNumberTicketFieldValue[queryString]
      } else {
        throw new Error(`Unable to get ticket field value from field: ${ticketFieldId}`)
      }
    } catch (e) {
      throw new Error('Unable to retrieve order number from provided ticket field')
    }
  }

  async attemptAutoFetchOrderStatus () {
    try {
      const orderNumber = await this.retrieveOrderNumberFromTicketField(this.props.orderNumberTicketFieldId)
      if (orderNumber) {
        try {
          const userId = this.props.userId
          const response = await this.fetchCheckpointsHeaders(userId, orderNumber)
          this.setState({
            orderHeaders: response.header,
            exception: undefined
          })
        } catch (e) {
          this.setState({
            showOrderNumberInput: true,
            orderHeader: [],
            exception: {
              type: 'error',
              message: I18n.t('trackingStatus.error.automaticFetch.message')
            }
          })
        }
      }
    } catch (e) {
      this.setState({
        showOrderNumberInput: true,
        orderHeader: [],
        exception: {
          type: 'warning',
          message: I18n.t('trackingStatus.warning.invalidOrderNumberTicketFieldId.message')
        }
      })
    }
  }

  async componentDidMount () {
    resizeContainer(zafClient)

    this.attemptAutoFetchOrderStatus()
  }

  updateOrderNumber (event) {
    this.setState({orderNumber: event.target.value})
  }

  fetchCheckpointsHeaders (userId, orderNumber) {
    const request = {
      url: `https://api.parcellab.com/v2/checkpoints?u=${userId}&orderNo=${orderNumber}`,
      type: 'GET',
      cors: true
    }
    return zafClient.request(request)
  }

  async submitForm (event) {
    event.preventDefault()
    try {
      const userId = this.props.userId
      const response = await this.fetchCheckpointsHeaders(userId, this.state.orderNumber)
      this.setState({
        orderHeaders: response.header,
        exception: undefined
      })
    } catch (error) {
      this.setState({
        orderHeader: [],
        exception: {
          type: 'error',
          message: I18n.t('trackingStatus.error.manualFetch.message')
        }
      })
    }
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
          {this.state.exception && <Row>
            <Col md={12} style={{marginTop: '50px'}}>
              <Alert type={this.state.exception.type}>
                <Title>{I18n.t(`trackingStatus.${this.state.exception.type}.title`)}</Title>
                {this.state.exception.message}
                <Close id='root' onClick={() => this.setState({exception: undefined})} aria-label={I18n.t('trackingStatus.exception.close-aria-label')} />
              </Alert>
            </Col>
          </Row>}
          { !this.state.exception && this.state.orderHeaders &&
          <Row>
            <Col>
              <Table size='small' style={{marginTop: '25px'}}>
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
