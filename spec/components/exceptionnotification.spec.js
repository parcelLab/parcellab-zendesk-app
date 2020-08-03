/* eslint-env jest, browser */
import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'

import ExceptionNotification from '../../src/javascripts/modules/components/exceptionnotification'

describe('ExceptionNotification Component', () => {
  const exception = {
    type: 'error',
    message: 'erorr message'
  }
  const onClose = jest.fn()

  it('should display exception message', async () => {
    const { queryByText } = render(<ExceptionNotification exception={exception} onClose={onClose} />)

    await waitFor(() => {
      expect(queryByText(exception.message)).toBeInTheDocument()
    })
  })

  it('should call onClose if exception notification close button is triggered ', async () => {
    const { container } = render(<ExceptionNotification exception={exception} onClose={onClose} />)

    fireEvent.click(container.querySelector('button'))
    expect(onClose).toHaveBeenCalled()
  })
})
