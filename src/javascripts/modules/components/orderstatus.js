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

import I18n from '../../lib/i18n'

const directParcelLabPortalUrl = (trackingNumber, courierName) => `https://prtl.parcellab.com/trackings/details?trackingNo=${trackingNumber}&courier=${courierName}`

const toDateString = date => date.toLocaleDateString()

const OrderStatus = ({orderStatus}) => {
  return <Table size='small'>
    <Head>
      <HeaderRow>
        <HeaderCell width='50%'>{I18n.t('trackingStatus.trackingNumber')}</HeaderCell>
        <HeaderCell width='50%'>{I18n.t('trackingStatus.deliveryStatus')}</HeaderCell>
      </HeaderRow>
    </Head>
    <Body>
      { orderStatus.map((orderStatusEntry, index) =>
        <React.Fragment key={index}>
          <a
            style={{color: 'inherit', textDecoration: 'inherit'}}
            target='_blank'
            rel='noopener'
            href={directParcelLabPortalUrl(orderStatusEntry.trackingNumber, orderStatusEntry.courierName)}
          >
            <Row>
              <Cell style={{wordBreak: 'break-all'}} width='50%'>{orderStatusEntry.trackingNumber}</Cell>
              <Cell width='50%'>{orderStatusEntry.status.message}</Cell>
            </Row>
          </a>
          <GroupRow>
            <Cell width='100%'>
              {I18n.t('trackingStatus.lastupdated')}: <strong style={{ marginLeft: '5px' }}>{toDateString(orderStatusEntry.status.timestamp)}</strong>
            </Cell>
          </GroupRow>
        </React.Fragment>
      )}
    </Body>
  </Table>
}

OrderStatus.propTypes = {
  orderStatus: PropTypes.arrayOf(
    PropTypes.shape({
      trackingNumber: PropTypes.string.isRequired,
      courierName: PropTypes.string.isRequired,
      status: PropTypes.shape({
        message: PropTypes.string.isRequired,
        timestamp: PropTypes.instanceOf(Date).isRequired
      }).isRequired
    })
  ).isRequired
}

export default OrderStatus
