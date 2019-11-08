import React from 'react'
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

import I18n from '../../lib/i18n'

const directParcelLabPortalUrl = (trackingNumber, courrierName) => `https://prtl.parcellab.com/trackings/details?trackingNo=${trackingNumber}&courier=${courrierName}`

const OrderStatus = ({orderHeader}) => {
  return <Table size='small' style={{marginTop: '25px'}}>
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
      { orderHeader.map((header, index) =>
        <a
          key={index}
          style={{color: 'inherit', textDecoration: 'inherit'}}
          target='_blank'
          rel='noopener'
          href={directParcelLabPortalUrl(header.tracking_number, header.courier.name)}
        >
          <TableRow>
            <Cell style={{wordBreak: 'break-all'}} width='50%'>{header.tracking_number}</Cell>
            <Cell width='50%'>{header.last_delivery_status.status}</Cell>
          </TableRow>
        </a>
      )}
    </Body>
  </Table>
}

export default OrderStatus
