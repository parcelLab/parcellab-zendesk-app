/* eslint-env jest, browser */
import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import TrackingStatus from '../src/javascripts/modules/trackingstatus'
import zafClient from '../src/javascripts/lib/zafClient'
jest.mock('../src/javascripts/lib/zafClient', () => {
  return {
    invoke: jest.fn(),
    metadata: jest.fn().mockReturnValue(Promise.resolve({
      settings: {
        userId: 'some-user-id'
      }
    })),
    request: jest.fn()
  }
})

describe('TrackingStatus Component', () => {
  beforeEach(() => [
    jest.clearAllMocks()
  ])

  it('should render without a currentUser', () => {
    const {getByText} = render(<TrackingStatus />)
    expect(getByText('Hello ! What order would you like to check?')).toBeDefined()
  })

  it('should render with a currentUser', () => {
    const {getByText} = render(<TrackingStatus currentUser='Timmy Testface' />)
    expect(getByText('Hello Timmy Testface! What order would you like to check?')).toBeDefined()
  })

  it('should show order status for each parcel if checkpoints have been fetched successfully', async () => {
    zafClient.request = jest.fn().mockReturnValue(Promise.resolve(
      {
        header: [{
          courier: {
            name: 'dhl'
          },
          tracking_number: 'trackingNummber1',
          last_delivery_status: {
            status: 'Delivery is being prepared'
          }
        }, {
          courier: {
            name: 'dhl'
          },
          tracking_number: 'trackingNummber2',
          last_delivery_status: {
            status: 'Ready for Collection'
          }
        }]
      }
    ))
    const { getByLabelText, findByText, container } = render(<TrackingStatus />)
    fireEvent.change(getByLabelText(/order/i), {target: {value: '123456'}})
    fireEvent.click(container.querySelector('Button'))

    expect(await findByText(/delivery is being prepared/i)).toBeDefined()
    expect(await findByText(/ready for collection/i)).toBeDefined()
  })

  it('should show tracking number for each parcel if checkpoints has been fetched successfully', async () => {
    zafClient.request = jest.fn().mockReturnValue(Promise.resolve(
      {
        header: [{
          courier: {
            name: 'dhl'
          },
          tracking_number: 'trackingNummber1',
          last_delivery_status: {
            status: 'Delivery is being prepared'
          }
        }, {
          courier: {
            name: 'dhl'
          },
          tracking_number: 'trackingNummber2',
          last_delivery_status: {
            status: 'Ready for Collection'
          }
        }]
      }
    ))
    const { getByLabelText, findByText, container } = render(<TrackingStatus />)
    fireEvent.change(getByLabelText(/order/i), {target: {value: '123456'}})
    fireEvent.click(container.querySelector('Button'))

    expect(await findByText(/delivery is being prepared/i)).toBeDefined()
    expect(await findByText(/trackingNummber1/i)).toBeDefined()
    expect(await findByText(/ready for collection/i)).toBeDefined()
    expect(await findByText(/trackingNummber2/i)).toBeDefined()
  })

  it('should show error message if checkpoints could not be fetched successfully', async () => {
    zafClient.request = jest.fn().mockRejectedValue('error')
    const { getByLabelText, findByText, container } = render(<TrackingStatus />)
    fireEvent.change(getByLabelText(/order/i), {target: {value: '123456'}})
    fireEvent.click(container.querySelector('Button'))

    const orderStatus = await findByText(/cannot be found/i)
    expect(orderStatus).toBeDefined()
  })
})
