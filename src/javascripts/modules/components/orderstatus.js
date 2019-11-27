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
import { IconButton, Icon } from '@zendeskgarden/react-buttons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'

import I18n from '../../lib/i18n'

const directParcelLabPortalUrl = (trackingNumber, courierName) => `https://prtl.parcellab.com/trackings/details?trackingNo=${trackingNumber}&courier=${courierName}`

const toDateString = date => date.toLocaleDateString()

const OrderStatus = ({orderStatus}) => {
  return <Table size='small'>
    <Head>
      <HeaderRow>
        <HeaderCell minimum width='45%'>{I18n.t('trackingStatus.trackingNumber')}</HeaderCell>
        <HeaderCell minimum width='45%'>{I18n.t('trackingStatus.deliveryStatus')}</HeaderCell>
        <HeaderCell minimum width='10%' />
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
              <Cell minimum style={{wordBreak: 'break-all'}} width='45%'>{orderStatusEntry.trackingNumber}</Cell>
              <Cell minimum width='45%'>{orderStatusEntry.status.message}</Cell>
              <Cell minimum width='10%'>
                <IconButton>
                  <Icon>
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </Icon>
                </IconButton>
              </Cell>
            </Row>
          </a>
          <GroupRow>
            <Cell minimum width='100%'>
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
