/* eslint-env jest, browser */
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, wait } from '@testing-library/react'

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
    expect(getByText('Hello ! What order would you like to check?')).toBeInTheDocument()
  })

  it('should render with a currentUser', () => {
    const {getByText} = render(<TrackingStatus currentUser='Timmy Testface' />)
    expect(getByText('Hello Timmy Testface! What order would you like to check?')).toBeInTheDocument()
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

    expect(await findByText(/delivery is being prepared/i)).toBeInTheDocument()
    expect(await findByText(/ready for collection/i)).toBeInTheDocument()
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

    expect(await findByText(/delivery is being prepared/i)).toBeInTheDocument()
    expect(await findByText(/trackingNummber1/i)).toBeInTheDocument()
    expect(await findByText(/ready for collection/i)).toBeInTheDocument()
    expect(await findByText(/trackingNummber2/i)).toBeInTheDocument()
  })

  it('should have a disabled check button if input field is empty', async () => {
    const { getByLabelText, container } = render(<TrackingStatus />)
    fireEvent.change(getByLabelText(/order/i), {target: {value: ''}})
    fireEvent.click(container.querySelector('Button'))

    await wait(() => {
      expect(container.querySelector('Button')).toHaveAttribute('disabled')
    })
  })

  it('should show error message if checkpoints could not be fetched successfully', async () => {
    zafClient.request = jest.fn().mockRejectedValue('error')
    const { getByLabelText, getByText, container } = render(<TrackingStatus />)
    fireEvent.change(getByLabelText(/order/i), {target: {value: '123456'}})
    fireEvent.click(container.querySelector('Button'))

    await wait(() => {
      expect(getByText(/could not be found/i)).toBeInTheDocument()
    })
  })

  it('should close error message if close button of error notification is clicked', async () => {
    zafClient.request = jest.fn().mockRejectedValue('error')
    const { getByLabelText, getByText, container, queryByText } = render(<TrackingStatus />)
    fireEvent.change(getByLabelText(/order/i), {target: {value: '123456'}})
    fireEvent.click(container.querySelector('Button'))

    await wait(() => {
      expect(getByText(/could not be found/i)).toBeInTheDocument()
    })

    fireEvent.click(getByLabelText(/close error notification/i))

    await wait(() => {
      expect(queryByText(/could not be found/i)).not.toBeInTheDocument()
    })
  })
})
