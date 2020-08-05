/* eslint-env jest, browser */
import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'

import TrackingStatus from '../src/javascripts/modules/trackingstatus'
import ZendeskClient from '../src/javascripts/lib/zendeskclient'
jest.mock('../src/javascripts/lib/zendeskclient.js')

describe('TrackingStatus Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ZendeskClient.resizeContainer = jest.fn()
    ZendeskClient.fetchCheckpoints = jest.fn().mockReturnValue(Promise.resolve(
      {
        header: [{
          id: 'tracking1',
          courier: {
            name: 'dhl'
          },
          tracking_number: 'trackingNummber1',
          last_delivery_status: {
            status: 'Delivery is being prepared'
          }
        }, {
          id: 'tracking2',
          courier: {
            name: 'dhl'
          },
          tracking_number: 'trackingNummber2',
          last_delivery_status: {
            status: 'Ready for Collection'
          }
        }],
        body: {
          tracking1: [{
            timestamp: '2018-04-01T00:00:00.000Z'
          }, {
            timestamp: '2018-04-04T18:14:59.000Z'
          }],
          tracking2: [{
            timestamp: '2018-04-12T00:00:00.000Z'
          }, {
            timestamp: '2018-06-006T18:14:59.000Z'
          }]
        }
      }
    ))
  })

  describe('order number manually provided through order number form field', () => {
    it('should show order status for each parcel if checkpoints have been fetched successfully', async () => {
      const { getByLabelText, queryByText, container } = render(<TrackingStatus />)

      await waitFor(() => {
        expect(container.querySelector('Button[type=submit]')).toBeInTheDocument()
      })

      fireEvent.change(getByLabelText(/order/i), { target: { value: '123456' } })
      fireEvent.click(container.querySelector('Button[type=submit]'))

      await waitFor(() => {
        expect(queryByText(/delivery is being prepared/i)).toBeInTheDocument()
        expect(queryByText(/ready for collection/i)).toBeInTheDocument()
      })
    })

    it('should show tracking number for each parcel if checkpoints has been fetched successfully', async () => {
      const { getByLabelText, queryByText, container } = render(<TrackingStatus />)

      await waitFor(() => {
        expect(container.querySelector('Button[type=submit]')).toBeInTheDocument()
      })

      fireEvent.change(getByLabelText(/order/i), { target: { value: '123456' } })
      fireEvent.click(container.querySelector('Button[type=submit]'))

      await waitFor(() => {
        expect(queryByText(/delivery is being prepared/i)).toBeInTheDocument()
        expect(queryByText(/trackingNummber1/i)).toBeInTheDocument()
        expect(queryByText(/ready for collection/i)).toBeInTheDocument()
        expect(queryByText(/trackingNummber2/i)).toBeInTheDocument()
      })
    })

    it('should provide direct link to parcelLab portal for each fetched tracking number', async () => {
      const { getByLabelText, container } = render(<TrackingStatus />)

      await waitFor(() => {
        expect(container.querySelector('Button[type=submit]')).toBeInTheDocument()
      })

      fireEvent.change(getByLabelText(/order/i), { target: { value: '123456' } })
      fireEvent.click(container.querySelector('Button[type=submit]'))

      await waitFor(() => {
        expect(container.querySelector('a')).toHaveAttribute('href', 'https://prtl.parcellab.com/trackings/details?trackingNo=trackingNummber1&courier=dhl')
      })
    })

    it('should have a disabled check button if input field is empty', async () => {
      const { getByLabelText, container } = render(<TrackingStatus />)

      await waitFor(() => {
        expect(container.querySelector('Button[type=submit]')).toBeInTheDocument()
      })

      fireEvent.change(getByLabelText(/order/i), { target: { value: '' } })
      fireEvent.click(container.querySelector('Button[type=submit]'))

      await waitFor(() => {
        expect(container.querySelector('Button[type=submit]')).toHaveAttribute('disabled')
      })
    })

    it('should show bad request error message if checkpoints could not be found due to a 4xx response code', async () => {
      ZendeskClient.fetchCheckpoints = jest.fn().mockRejectedValue({ status: 400 })
      const { getByLabelText, getByText, container } = render(<TrackingStatus />)

      await waitFor(() => {
        expect(container.querySelector('Button[type=submit]')).toBeInTheDocument()
      })

      fireEvent.change(getByLabelText(/order/i), { target: { value: '123456' } })
      fireEvent.click(container.querySelector('Button[type=submit]'))

      await waitFor(() => {
        expect(getByText(/could not be found/i)).toBeInTheDocument()
      })
    })

    it('should show server error message if checkpoints could not be fetched due to a 5xx response code', async () => {
      ZendeskClient.fetchCheckpoints = jest.fn().mockRejectedValue({ status: 500 })
      const { getByLabelText, getByText, container } = render(<TrackingStatus />)

      await waitFor(() => {
        expect(container.querySelector('Button[type=submit]')).toBeInTheDocument()
      })

      fireEvent.change(getByLabelText(/order/i), { target: { value: '123456' } })
      fireEvent.click(container.querySelector('Button[type=submit]'))

      await waitFor(() => {
        expect(getByText(/response code: 500/i)).toBeInTheDocument()
      })
    })

    it('should close exception message if close button of notification is clicked', async () => {
      ZendeskClient.fetchCheckpoints = jest.fn().mockRejectedValue('error')
      const { getByLabelText, getByText, container, queryByText } = render(<TrackingStatus />)

      await waitFor(() => {
        expect(container.querySelector('Button[type=submit]')).toBeInTheDocument()
      })

      fireEvent.change(getByLabelText(/order/i), { target: { value: '123456' } })
      fireEvent.click(container.querySelector('Button[type=submit]'))

      await waitFor(() => {
        expect(getByText(/could not be found/i)).toBeInTheDocument()
      })

      fireEvent.click(getByLabelText(/close notification/i))

      await waitFor(() => {
        expect(queryByText(/could not be found/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('order number automatically provided through Zendesk ticket field', () => {
    it('should automatically fetch order status for each parcel if orderNumberTicketFieldId is provided', async () => {
      const userId = 'some-user-id'
      const orderNumberTicketFieldId = 'ticketFieldId'
      ZendeskClient.getValueFromCustomTicketField = jest.fn().mockReturnValue(Promise.resolve('some-order-number'))
      const { queryByText } = render(<TrackingStatus userId={userId} orderNumberTicketFieldId={orderNumberTicketFieldId} />)

      await waitFor(() => {
        expect(queryByText(/delivery is being prepared/i)).toBeInTheDocument()
        expect(queryByText(/ready for collection/i)).toBeInTheDocument()
      })
    })

    it('should provide direct link to parcelLab portal for each fetched tracking number', async () => {
      const userId = 'some-user-id'
      const orderNumberTicketFieldId = 'ticketFieldId'
      ZendeskClient.getValueFromCustomTicketField = jest.fn().mockReturnValue(Promise.resolve('some-order-number'))
      const { container } = render(<TrackingStatus userId={userId} orderNumberTicketFieldId={orderNumberTicketFieldId} />)

      await waitFor(() => {
        expect(container.querySelector('a')).toHaveAttribute('href', 'https://prtl.parcellab.com/trackings/details?trackingNo=trackingNummber1&courier=dhl')
      })
    })

    it('should show submission form if automatically fetching of order status based on orderNumberTicketFieldId failed', async () => {
      const userId = 'some-user-id'
      const orderNumberTicketFieldId = 'ticketFieldId'
      ZendeskClient.getValueFromCustomTicketField = jest.fn().mockReturnValue(Promise.resolve('some-order-number'))
      ZendeskClient.fetchCheckpoints = jest.fn().mockRejectedValue('error')
      const { queryByText, container } = render(<TrackingStatus userId={userId} orderNumberTicketFieldId={orderNumberTicketFieldId} />)

      await waitFor(() => {
        expect(container.querySelector('Button[type=submit]')).toBeInTheDocument()
        expect(queryByText(/delivery is being prepared/i)).not.toBeInTheDocument()
        expect(queryByText(/ready for collection/i)).not.toBeInTheDocument()
      })
    })

    it('should show submission form if automatically retrieved order number from configured orderNumbterTicketFieldId was empty', async () => {
      const userId = 'some-user-id'
      const orderNumberTicketFieldId = 'ticketFieldId'
      ZendeskClient.getValueFromCustomTicketField = jest.fn().mockReturnValue(Promise.resolve(''))
      const { queryByText, container } = render(<TrackingStatus userId={userId} orderNumberTicketFieldId={orderNumberTicketFieldId} />)

      await waitFor(() => {
        expect(container.querySelector('Button[type=submit]')).toBeInTheDocument()
        expect(queryByText(/delivery is being prepared/i)).not.toBeInTheDocument()
        expect(queryByText(/ready for collection/i)).not.toBeInTheDocument()
        expect(queryByText(/could not automatically retrieve/i)).not.toBeInTheDocument()
      })
    })

    it('should show submission form and no error if orderNumberTicketFieldId is not configured (i.e. empty)', async () => {
      const userId = 'some-user-id'
      const orderNumberTicketFieldId = ''
      const { queryByText, container } = render(<TrackingStatus userId={userId} orderNumberTicketFieldId={orderNumberTicketFieldId} />)

      await waitFor(() => {
        expect(container.querySelector('Button[type=submit]')).toBeInTheDocument()
        expect(queryByText(/delivery is being prepared/i)).not.toBeInTheDocument()
        expect(queryByText(/ready for collection/i)).not.toBeInTheDocument()
        expect(queryByText(/could not automatically retrieve/i)).not.toBeInTheDocument()
      })
    })

    it('should show error message if automatically fetching of order status based on orderNumberTicketFieldId failed', async () => {
      const userId = 'some-user-id'
      const orderNumberTicketFieldId = 'ticketFieldId'
      ZendeskClient.getValueFromCustomTicketField = jest.fn().mockReturnValue(Promise.resolve('some-order-number'))
      ZendeskClient.fetchCheckpoints = jest.fn().mockRejectedValue('error')
      const { queryByText } = render(<TrackingStatus userId={userId} orderNumberTicketFieldId={orderNumberTicketFieldId} />)

      await waitFor(() => {
        expect(queryByText(/order number status could not be found/i)).toBeInTheDocument()
      })
    })

    it('should show warn message if orderNumberTicketFieldId value retrieval failed', async () => {
      const userId = 'some-user-id'
      const orderNumberTicketFieldId = 'ticketFieldId'
      ZendeskClient.getValueFromCustomTicketField = jest.fn().mockRejectedValue('error')
      const { queryByText } = render(<TrackingStatus userId={userId} orderNumberTicketFieldId={orderNumberTicketFieldId} />)

      await waitFor(() => {
        expect(queryByText(/could not automatically retrieve order number from zendesk ticket/i)).toBeInTheDocument()
      })
    })
  })
})
