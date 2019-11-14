/* eslint-env jest, browser */
import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import OrderNumberInput from '../../src/javascripts/modules/components/ordernumberinput'

describe('OrderNumberInput Component', () => {
  const orderNumber = 'orderNumber'
  const onOrderNumberChange = jest.fn()
  const onSubmit = jest.fn()

  it('should display passed in orderNumber in input field', async () => {
    const { getByLabelText } = render(<OrderNumberInput orderNumber={orderNumber} onOrderNumberChange={onOrderNumberChange} onSubmit={onSubmit} />)

    expect(getByLabelText(/order/i)).toHaveValue(orderNumber)
  })

  it('should call onOrderNumberChange if input field change event is triggered', async () => {
    const { getByLabelText } = render(<OrderNumberInput orderNumber={orderNumber} onOrderNumberChange={onOrderNumberChange} onSubmit={onSubmit} />)

    fireEvent.change(getByLabelText(/order/i), {target: {value: 'changeValue'}})

    expect(onOrderNumberChange).toHaveBeenCalled()
  })

  it('should call onSubmit if button is clicked', async () => {
    const { getByTestId } = render(<OrderNumberInput orderNumber={orderNumber} onOrderNumberChange={onOrderNumberChange} onSubmit={onSubmit} />)

    fireEvent.submit(getByTestId('form'))

    expect(onSubmit).toHaveBeenCalled()
  })

  it('should have disabled button if input field is empty', async () => {
    const { container } = render(<OrderNumberInput orderNumber={''} onOrderNumberChange={onOrderNumberChange} onSubmit={onSubmit} />)

    expect(container.querySelector('button')).toHaveAttribute('disabled')
  })

  it('should have disabled button and input field if disabled is true', async () => {
    const { container, getByLabelText } = render(<OrderNumberInput disabled orderNumber={orderNumber} onOrderNumberChange={onOrderNumberChange} onSubmit={onSubmit} />)

    expect(container.querySelector('button')).toHaveAttribute('disabled')
    expect(getByLabelText(/order/i)).toHaveAttribute('disabled')
  })
})
