/* eslint-env jest, browser */
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, wait } from '@testing-library/react'

import TrackingStatus from '../src/javascripts/modules/trackingstatus'
import zafClient from '../src/javascripts/lib/zafClient'
jest.mock('../src/javascripts/lib/zafClient', () => {
  return {
    invoke: jest.fn()
  }
})

describe('TrackingStatus Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    zafClient.metadata = jest.fn().mockReturnValue(Promise.resolve({
      settings: {
        userId: 'some-user-id',
        orderNumberTicketFieldId: undefined
      }
    }))
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
  })

  it('should render without a currentUser', async () => {
    const {getByText} = render(<TrackingStatus />)
    await wait(() => {
      expect(getByText('Hello ! What order would you like to check?')).toBeInTheDocument()
    })
  })

  it('should render with a currentUser', async () => {
    const {getByText} = render(<TrackingStatus currentUser='Timmy Testface' />)
    await wait(() => {
      expect(getByText('Hello Timmy Testface! What order would you like to check?')).toBeInTheDocument()
    })
  })

  describe('order number manually provided through order number form field', () => {
    it('should show order status for each parcel if checkpoints have been fetched successfully', async () => {
      const { getByLabelText, queryByText, container } = render(<TrackingStatus />)

      await wait(() => {
        expect(container.querySelector('Button[type=submit]')).toBeInTheDocument()
      })

      fireEvent.change(getByLabelText(/order/i), {target: {value: '123456'}})
      fireEvent.click(container.querySelector('Button[type=submit]'))

      await wait(() => {
        expect(queryByText(/delivery is being prepared/i)).toBeInTheDocument()
        expect(queryByText(/ready for collection/i)).toBeInTheDocument()
      })
    })

    it('should show tracking number for each parcel if checkpoints has been fetched successfully', async () => {
      const { getByLabelText, queryByText, container } = render(<TrackingStatus />)
      await wait(() => {
        expect(container.querySelector('Button[type=submit]')).toBeInTheDocument()
      })

      fireEvent.change(getByLabelText(/order/i), {target: {value: '123456'}})
      fireEvent.click(container.querySelector('Button[type=submit]'))

      await wait(() => {
        expect(queryByText(/delivery is being prepared/i)).toBeInTheDocument()
        expect(queryByText(/trackingNummber1/i)).toBeInTheDocument()
        expect(queryByText(/ready for collection/i)).toBeInTheDocument()
        expect(queryByText(/trackingNummber2/i)).toBeInTheDocument()
      })
    })

    it('should have a disabled check button if input field is empty', async () => {
      const { getByLabelText, container } = render(<TrackingStatus />)
      await wait(() => {
        expect(container.querySelector('Button[type=submit]')).toBeInTheDocument()
      })

      fireEvent.change(getByLabelText(/order/i), {target: {value: ''}})
      fireEvent.click(container.querySelector('Button[type=submit]'))

      await wait(() => {
        expect(container.querySelector('Button[type=submit]')).toHaveAttribute('disabled')
      })
    })

    it('should show error message if checkpoints could not be fetched successfully', async () => {
      zafClient.request = jest.fn().mockRejectedValue('error')
      const { getByLabelText, getByText, container } = render(<TrackingStatus />)
      await wait(() => {
        expect(container.querySelector('Button[type=submit]')).toBeInTheDocument()
      })

      fireEvent.change(getByLabelText(/order/i), {target: {value: '123456'}})
      fireEvent.click(container.querySelector('Button[type=submit]'))

      await wait(() => {
        expect(getByText(/could not be found/i)).toBeInTheDocument()
      })
    })

    it('should close error message if close button of error notification is clicked', async () => {
      zafClient.request = jest.fn().mockRejectedValue('error')
      const { getByLabelText, getByText, container, queryByText } = render(<TrackingStatus />)
      await wait(() => {
        expect(container.querySelector('Button[type=submit]')).toBeInTheDocument()
      })

      fireEvent.change(getByLabelText(/order/i), {target: {value: '123456'}})
      fireEvent.click(container.querySelector('Button[type=submit]'))

      await wait(() => {
        expect(getByText(/could not be found/i)).toBeInTheDocument()
      })

      fireEvent.click(getByLabelText(/close error notification/i))

      await wait(() => {
        expect(queryByText(/could not be found/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('order number automatically provided through Zendesk ticket field', () => {
    it('should automatically fetch order status for each parcel if orderNumberTicketFieldId is provided', async () => {
      zafClient.metadata = jest.fn().mockReturnValue(Promise.resolve({
        settings: {
          userId: 'some-user-id',
          orderNumberTicketFieldId: 'ticketFieldId'
        }
      }))

      zafClient.get = jest.fn().mockReturnValue(Promise.resolve({
        'ticket.customField:custom_field_ticketFieldId': 'some-order-number'
      }))

      const { queryByText } = render(<TrackingStatus />)

      await wait(() => {
        expect(queryByText(/delivery is being prepared/i)).toBeInTheDocument()
        expect(queryByText(/ready for collection/i)).toBeInTheDocument()
      })
    })

    it('should show submission form if automatically fetching of order status based on orderNumberTicketFieldId failed', async () => {
      zafClient.metadata = jest.fn().mockReturnValue(Promise.resolve({
        settings: {
          userId: 'some-user-id',
          orderNumberTicketFieldId: 'ticketFieldId'
        }
      }))
      zafClient.get = jest.fn().mockReturnValue(Promise.resolve({
        'ticket.customField:custom_field_ticketFieldId': 'some-order-number'
      }))
      zafClient.request = jest.fn().mockRejectedValue('error')

      const { queryByText, container } = render(<TrackingStatus />)

      await wait(() => {
        expect(container.querySelector('Button[type=submit]')).toBeInTheDocument()
        expect(queryByText(/delivery is being prepared/i)).not.toBeInTheDocument()
        expect(queryByText(/ready for collection/i)).not.toBeInTheDocument()
      })
    })
  })
})
