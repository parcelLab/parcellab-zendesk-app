import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Row, Col } from '@zendeskgarden/react-grid'
import { Button } from '@zendeskgarden/react-buttons'
import { Field, Label, Hint, Input } from '@zendeskgarden/react-forms'

import I18n from '../../lib/i18n'

const OrderNumberInputForm = ({orderNumber, onOrderNumberChange, onSubmit, disabled = false}) => {
  return <form onSubmit={onSubmit} data-testid='form'>
    <Grid>
      <Row>
        <Col md={12}>
          <Field stretched>
            <Label>{I18n.t('trackingStatus.orderNumber')}</Label>
            <Hint>{I18n.t('trackingStatus.orderNumberHint')}</Hint>
            <Input disabled={disabled} onChange={onOrderNumberChange} value={orderNumber} />
          </Field>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Button disabled={disabled || orderNumber.length === 0} stretched type='submit'>{I18n.t('trackingStatus.checkButton')}</Button>
        </Col>
      </Row>
    </Grid>
  </form>
}

OrderNumberInputForm.propTypes = {
  orderNumber: PropTypes.string.isRequired,
  onOrderNumberChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  disabled: PropTypes.bool
}

export default OrderNumberInputForm
