/* eslint-env jest, browser */
import React from 'react'
import { render, waitFor } from '@testing-library/react'

import OrderStatus from '../../src/javascripts/modules/components/orderstatus'

describe('OrderStatus Component', () => {
  const orderStatus = [{
    trackingNumber: 'trackingNumber1',
    courierName: 'courierName1',
    status: {
      message: 'lastDeliveryStatus1',
      timestamp: new Date('2018-01-01T12:00:00.000Z')
    }
  },
  {
    trackingNumber: 'trackingNumber2',
    courierName: 'courierName2',
    status: {
      message: 'lastDeliveryStatus2',
      timestamp: new Date('2019-01-01T12:00:00.000Z')
    }
  }]

  it('should display a tablerow for each orderStatus entry', async () => {
    const { queryByText } = render(<OrderStatus orderStatus={orderStatus} />)

    await waitFor(() => {
      expect(queryByText(orderStatus[0].trackingNumber)).toBeInTheDocument()
      expect(queryByText(orderStatus[0].status.message)).toBeInTheDocument()
      expect(queryByText(orderStatus[1].trackingNumber)).toBeInTheDocument()
      expect(queryByText(orderStatus[1].status.message)).toBeInTheDocument()
    })
  })

  it('should display a timestamp as LocaleDateString for each orderStatus entry', async () => {
    const { queryByText } = render(<OrderStatus orderStatus={orderStatus} />)

    await waitFor(() => {
      expect(queryByText(orderStatus[0].status.timestamp.toLocaleDateString())).toBeInTheDocument()
      expect(queryByText(orderStatus[1].status.timestamp.toLocaleDateString())).toBeInTheDocument()
    })
  })

  it('should contain a direct link to the tracking in the parcelLab portal', async () => {
    const { getByTestId } = render(<OrderStatus orderStatus={orderStatus} />)

    await waitFor(() => {
      expect(getByTestId('trackingNumber1-link'))
        .toHaveAttribute('href', `https://prtl.parcellab.com/trackings/details?trackingNo=${orderStatus[0].trackingNumber}&courier=${orderStatus[0].courierName}`)
      expect(getByTestId('trackingNumber2-link'))
        .toHaveAttribute('href', `https://prtl.parcellab.com/trackings/details?trackingNo=${orderStatus[1].trackingNumber}&courier=${orderStatus[1].courierName}`)
    })
  })
})
