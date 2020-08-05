/* eslint-env jest, browser */
import App from '../src/javascripts/modules/app'
import {
  getByLabelText,
  getByText,
  queryByText,
  queryByLabelText,
  waitFor,
  fireEvent
} from '@testing-library/dom'

describe('ParcelLab App Module Integration', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  it('succesfully retrieves order number from ticket field and displays order status', async () => {
    global.InitializedZAFClient.get = jest.fn().mockImplementation(queryString => {
      if (queryString === 'currentUser') {
        return Promise.resolve({
          currentUser: {
            locale: 'en'
          }
        })
      } else {
        return Promise.resolve({
          'ticket.customField:custom_field_sampleOrderNumberTicketFieldId': 'sampleOrderNumber'
        })
      }
    })

    global.InitializedZAFClient.metadata = jest.fn().mockReturnValue(Promise.resolve({
      settings: {
        userId: 'sampleUserId',
        orderNumberTicketFieldId: 'sampleOrderNumberTicketFieldId'
      }
    }))

    global.InitializedZAFClient.request = jest.fn().mockReturnValue(Promise.resolve({
      header: [{
        id: 'tracking1',
        tracking_number: 'sampleTrackingNumber',
        courier: {
          name: 'sampleCourierName',
          prettyname: 'SCN'
        },
        last_delivery_status: {
          status: 'deliveryStatus'
        }
      }],
      body: {
        tracking1: [{
          timestamp: '2018-04-01T00:00:00.000Z'
        }, {
          timestamp: '2018-04-04T18:14:59.000Z'
        }]
      }
    }))

    document.body.innerHTML = '<section data-main id="root"><img class="loader" src="spinner.gif"/></section>'
    await App({})

    const container = document.body

    await waitFor(() => {
      expect(queryByLabelText(container, /order/i)).not.toBeInTheDocument()
      expect(container.querySelector('button[type="submit"]')).not.toBeInTheDocument()
      expect(queryByText(container, /could not/i)).not.toBeInTheDocument()

      expect(getByText(container, /sampleTrackingNumber/i)).toBeInTheDocument()
      expect(getByText(container, /deliveryStatus/i)).toBeInTheDocument()
    })
  })

  it('succesfully uses entered order number from form and displays order status', async () => {
    global.InitializedZAFClient.get = jest.fn().mockReturnValue(Promise.resolve({
      currentUser: {
        locale: 'en'
      }
    }))

    global.InitializedZAFClient.metadata = jest.fn().mockReturnValue(Promise.resolve({
      settings: {
        userId: 'sampleUserId',
        orderNumberTicketFieldId: null
      }
    }))

    global.InitializedZAFClient.request = jest.fn().mockReturnValue(Promise.resolve({
      header: [{
        id: 'tracking1',
        tracking_number: 'sampleTrackingNumber',
        courier: {
          name: 'sampleCourierName',
          prettyname: 'SCN'
        },
        last_delivery_status: {
          status: 'deliveryStatus'
        }
      }],
      body: {
        tracking1: [{
          timestamp: '2018-04-01T00:00:00.000Z'
        }, {
          timestamp: '2018-04-04T18:14:59.000Z'
        }]
      }
    }))

    document.body.innerHTML = '<section data-main id="root"><img class="loader" src="spinner.gif"/></section>'
    await App({})

    const container = document.body

    await waitFor(() => {
      expect(queryByLabelText(container, /order/i)).toBeInTheDocument()
      expect(container.querySelector('button')).toBeInTheDocument()
    })

    fireEvent.change(getByLabelText(container, /order/i), { target: { value: '123456' } })
    fireEvent.click(container.querySelector('Button[type=submit]'))

    await waitFor(() => {
      expect(getByText(container, /sampleTrackingNumber/i)).toBeInTheDocument()
      expect(getByText(container, /deliveryStatus/i)).toBeInTheDocument()
    })
  })
})
