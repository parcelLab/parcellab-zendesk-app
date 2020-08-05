/* eslint-env jest, browser */
import React from 'react'
import { render, waitFor } from '@testing-library/react'

import CourierIcon from '../../src/javascripts/modules/components/couriericon'

describe('CourierIcon Component', () => {
  it('should display courier pretty name', async () => {
    const courier = {
      name: 'dhl-germany',
      prettyName: 'DHL'
    }
    const { queryByText } = render(<CourierIcon courier={courier.name}>{courier.prettyName}</CourierIcon>)

    await waitFor(() => {
      expect(queryByText(courier.prettyName)).toBeInTheDocument()
    })
  })
})
