/* eslint-env jest, browser */
import React from 'react'
import { render, fireEvent, wait } from '@testing-library/react'

import OrderStatus from '../../src/javascripts/modules/components/orderstatus'

describe('OrderStatus Component', () => {
  const orderHeader = [{
    tracking_number: 'trackingNumber1',
    courier: {
      name: 'courrierName1'
    },
    last_delivery_status: {
      status: 'lastDeliveryStatus2'
    }
  },
  {
    tracking_number: 'trackingNumber2',
    courier: {
      name: 'courrierName2'
    },
    last_delivery_status: {
      status: 'lastDeliveryStatus3'
    }
  }]

  it('should display a tablerow for each orderHeader entry', async () => {
    const { queryByText } = render(<OrderStatus orderHeader={orderHeader} />)

    await wait(() => {
      expect(queryByText(orderHeader[0].tracking_number)).toBeInTheDocument()
      expect(queryByText(orderHeader[0].last_delivery_status.status)).toBeInTheDocument()
      expect(queryByText(orderHeader[1].tracking_number)).toBeInTheDocument()
      expect(queryByText(orderHeader[1].last_delivery_status.status)).toBeInTheDocument()
    })
  })

  it('should contain a direct link to the tracking in the parcelLab portal', async () => {
    const { getByText } = render(<OrderStatus orderHeader={orderHeader} />)

    await wait(() => {
      expect(getByText('trackingNumber1').closest('a'))
        .toHaveAttribute('href', `https://prtl.parcellab.com/trackings/details?trackingNo=${orderHeader[0].tracking_number}&courier=${orderHeader[0].courier.name}`)
      expect(getByText('trackingNumber2').closest('a'))
        .toHaveAttribute('href', `https://prtl.parcellab.com/trackings/details?trackingNo=${orderHeader[1].tracking_number}&courier=${orderHeader[1].courier.name}`)
    })
  })
})
