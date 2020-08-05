import React from 'react'
import PropTypes from 'prop-types'
import {
  Table,
  Head,
  HeaderRow,
  HeaderCell,
  Body,
  GroupRow,
  Row,
  Cell
} from '@zendeskgarden/react-tables'
import { IconButton } from '@zendeskgarden/react-buttons'
import { Tooltip } from '@zendeskgarden/react-tooltips'
import NewWindow from '@zendeskgarden/svg-icons/src/16/new-window-fill.svg'
import CourierIcon from './couriericon'
import I18n from '../../lib/i18n'

const directParcelLabPortalUrl = (trackingNumber, courierName) => `https://prtl.parcellab.com/trackings/details?trackingNo=${trackingNumber}&courier=${courierName}`

const toDateString = date => date.toLocaleDateString()

const OrderStatus = ({ orderStatus, displayCourierIcon = false }) => {
  return (
    <Table size='small'>
      <Head>
        <HeaderRow>
          <HeaderCell width='40%'>{I18n.t('trackingStatus.trackingNumber')}</HeaderCell>
          <HeaderCell width='40%'>{I18n.t('trackingStatus.deliveryStatus')}</HeaderCell>
          <HeaderCell width='20%' />
        </HeaderRow>
      </Head>
      <Body>
        {orderStatus.map((orderStatusEntry, index) =>
          <React.Fragment key={index}>

            <Row>
              <Cell width='40%' style={{ wordBreak: 'break-all' }}>
                {displayCourierIcon && <CourierIcon courier={orderStatusEntry.courier.name}>{orderStatusEntry.courier.prettyName}</CourierIcon>}
                {orderStatusEntry.trackingNumber}
              </Cell>
              <Cell width='40%'>{orderStatusEntry.status.message}</Cell>
              <Cell width='20%'>
                <Tooltip
                  placement='auto'
                  content={I18n.t('trackingStatus.tooltipExternalLink')}
                >
                  <a
                    target='_blank'
                    rel='noopener noreferrer'
                    href={directParcelLabPortalUrl(orderStatusEntry.trackingNumber, orderStatusEntry.courier.name)}
                    data-testid={orderStatusEntry.trackingNumber + '-link'}
                  >
                    <IconButton>
                      <NewWindow aria-label={I18n.t('trackingStatus.tooltipExternalLink')} />
                    </IconButton>
                  </a>
                </Tooltip>
              </Cell>
            </Row>
            <GroupRow>
              <Cell colSpan={3}>
                {I18n.t('trackingStatus.lastupdated')}: <strong style={{ marginLeft: '5px' }}>{toDateString(orderStatusEntry.status.timestamp)}</strong>
              </Cell>
            </GroupRow>
          </React.Fragment>
        )}
      </Body>
    </Table>
  )
}

OrderStatus.propTypes = {
  orderStatus: PropTypes.arrayOf(
    PropTypes.shape({
      trackingNumber: PropTypes.string.isRequired,
      courier: PropTypes.shape({
        name: PropTypes.string.isRequired,
        prettyName: PropTypes.string.isRequired
      }),
      status: PropTypes.shape({
        message: PropTypes.string.isRequired,
        timestamp: PropTypes.instanceOf(Date).isRequired
      }).isRequired
    })
  ).isRequired
}

export default OrderStatus
