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
import { Alert, Close, Title } from '@zendeskgarden/react-notifications'

import I18n from '../lib/i18n'
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
  }

  componentDidMount () {
    resizeContainer()
    this.attemptAutoFetchOrderStatus()
  }

  componentDidUpdate () {
    resizeContainer()
  }

  async attemptAutoFetchOrderStatus () {
    try {
      const orderNumber = await getValueFromCustomTicketField(this.props.orderNumberTicketFieldId)
      if (orderNumber && orderNumber.length > 0) {
        this.fetchOrderStatus(orderNumber)
      } else {
        this.setState({
          showOrderNumberInput: true,
          orderHeader: [],
          exception: undefined
        })
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
      this.setState({
        showOrderNumberInput: true,
        orderHeader: [],
        exception: {
          type: 'error',
          message: I18n.t('trackingStatus.error.fetch.message')
        }
      })
    }
  }

  async submitForm (event) {
    event.preventDefault()
    this.fetchOrderStatus(this.state.orderNumber)
  }

  render () {
    return <div>
      <form onSubmit={this.submitForm}>
        <Grid>
          {this.state.showOrderNumberInput &&
          <React.Fragment>
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
