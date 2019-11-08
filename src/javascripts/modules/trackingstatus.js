import React from 'react'
import { Button } from '@zendeskgarden/react-buttons'
import { Field, Label, Hint, Input } from '@zendeskgarden/react-forms'
import { Grid, Row, Col } from '@zendeskgarden/react-grid'
import { XL } from '@zendeskgarden/react-typography'
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

import I18n from '../lib/i18n'
import ExceptionNotification from './exceptionnotification'
import {resizeContainer, getValueFromCustomTicketField, fetchCheckpointsHeaders} from '../lib/zafclienthelper'

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
    this.fetchOrderStatus = this.fetchOrderStatus.bind(this)
    this.resetForm = this.resetForm.bind(this)
  }

  componentDidMount () {
    resizeContainer()
    this.attemptAutoFetchOrderStatus()
  }

  componentDidUpdate () {
    resizeContainer()
  }

  resetForm (exception) {
    this.setState({
      showOrderNumberInput: true,
      orderHeader: [],
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
          this.resetForm()
        }
      } catch (e) {
        this.resetForm({
          type: 'warning',
          message: I18n.t('trackingStatus.warning.invalidOrderNumberTicketFieldId.message')
        })
      }
    } else {
      this.resetForm()
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
        orderHeaders: response.header,
        exception: undefined
      })
    } catch (error) {
      this.resetForm({
        type: 'error',
        message: I18n.t('trackingStatus.error.fetch.message')
      })
    }
  }

  async submitForm (event) {
    event.preventDefault()
    this.fetchOrderStatus(this.state.orderNumber)
  }

  render () {
    return <div>
      <Grid>
        {this.state.showOrderNumberInput &&
          <form onSubmit={this.submitForm}>
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
          </form>
        }
        {this.state.exception && <Row>
          <Col md={12} style={{marginTop: '50px'}}>
            <ExceptionNotification exception={this.state.exception} onClose={() => this.setState({exception: undefined})} />
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
                    <a
                      key={index}
                      style={{color: 'inherit', textDecoration: 'inherit'}}
                      target='_blank'
                      rel='noopener'
                      href={`https://prtl.parcellab.com/trackings/details?trackingNo=${header.tracking_number}&courier=${header.courier.name}`}
                    >
                      <TableRow>
                        <Cell style={{wordBreak: 'break-all'}} width='50%'>{header.tracking_number}</Cell>
                        <Cell width='50%'>{header.last_delivery_status.status}</Cell>
                      </TableRow>
                    </a>
                  )}
                </Body>
              </Table>
            </Col>
          </Row>}
      </Grid>
    </div>
  }
}

export default TrackingStatus
