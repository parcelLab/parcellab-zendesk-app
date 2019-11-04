import React from 'react'
import { Button, IconButton, Icon } from '@zendeskgarden/react-buttons'
import SVG from 'react-inlinesvg'
import LinkIcon from '@zendeskgarden/svg-icons/src/16/share-fill.svg'
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

import I18n from '../lib/i18n'
import zafClient from '../lib/zafClient'
import {resizeContainer} from '../lib/helpers'

class TrackingStatus extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      orderNumber: '',
      orderHeaders: undefined,
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
          { !this.state.fetchError && this.state.orderHeaders &&
          <Row>
            <Col>
              <Table size='large' style={{marginTop: '50px'}}>
                <XL tag={Caption}>
                  {I18n.t('trackingStatus.orderStatus')}
                </XL>
                <Head>
                  <HeaderRow>
                    <HeaderCell width='42.5%'>{I18n.t('trackingStatus.trackingNumber')}</HeaderCell>
                    <HeaderCell width='42.5%'>{I18n.t('trackingStatus.deliveryStatus')}</HeaderCell>
                    <HeaderCell width='15%'>
                      <Icon size='small'>
                        <SVG src={LinkIcon} />
                      </Icon>
                    </HeaderCell>
                  </HeaderRow>
                </Head>
                <Body>
                  { this.state.orderHeaders.map((header, index) =>
                    <TableRow key={index} striped={index % 2 === 0}>
                      <Cell width='42.5'>{header.tracking_number}</Cell>
                      <Cell width='42.5%'>{header.last_delivery_status.status}</Cell>
                      <Cell width='15%'>
                        <a target='_blank' rel='noopener' href={`https://www.delivery-status.com/?courier=${header.courier.name}&trackingNo=${header.tracking_number}&lang=en`}>
                          <IconButton>
                            <Icon size='small'>
                              <SVG src={LinkIcon} />
                            </Icon>
                          </IconButton>
                        </a>
                      </Cell>
                    </TableRow>
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
