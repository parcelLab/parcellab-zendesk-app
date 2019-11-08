import React from 'react'
import { Grid, Row, Col } from '@zendeskgarden/react-grid'
import { Button } from '@zendeskgarden/react-buttons'
import { Field, Label, Hint, Input } from '@zendeskgarden/react-forms'

import I18n from '../lib/i18n'

const OrderNumberInputForm = ({orderNumber, onOrderNumberChange, onSubmit}) => {
  return <form onSubmit={onSubmit}>
    <Grid>
      <Row>
        <Col md={12}>
          <Field stretched>
            <Label>{I18n.t('trackingStatus.orderNumber')}</Label>
            <Hint>{I18n.t('trackingStatus.orderNumberHint')}</Hint>
            <Input onChange={onOrderNumberChange} value={orderNumber} />
          </Field>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Button disabled={orderNumber.length === 0} stretched type='submit'>{I18n.t('trackingStatus.checkButton')}</Button>
        </Col>
      </Row>
    </Grid>
  </form>
}

export default OrderNumberInputForm
