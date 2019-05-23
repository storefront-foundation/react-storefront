/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import PropTypes from 'prop-types'
import React from 'react'
import MaskedInput from 'react-text-mask'
import classnames from 'classnames'
import { get } from 'lodash'

import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import withStyles from '@material-ui/core/styles/withStyles'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormHelperText from '@material-ui/core/FormHelperText'

import CardIcon from './CardIcon'
import { ccNumber } from './utils/autocomplete'
import CreditCardInformation, { ValidationResult } from './utils/card/CreditCardInformation'

function CreditCardNumberMask(props) {
  const { inputRef, ...other } = props
  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null)
      }}
      mask={[
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        ' ',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        ' ',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        ' ',
        /\d/,
        /\d/,
        /\d/,
        /\d/
      ]}
      placeholderChar={'\u2000'}
    />
  )
}

export const styles = theme => ({
  label: {},
  input: {},
  root: {}
})

@withStyles(styles, { name: 'RSFCreditCardNumberInput' })
class CreditCardNumberInput extends React.Component {
  static propTypes = {
    /**
     * The default value to use for card number
     */
    defaultValue: PropTypes.string,

    /**
     * The card type of `defaultValue`
     */
    defaultCardType: PropTypes.instanceOf(CreditCardInformation),

    /**
     * An array of CreditCardInformation objects describing the accepted card types
     */
    acceptedCardTypeInfo: PropTypes.arrayOf(PropTypes.instanceOf(CreditCardInformation)).isRequired,

    /**
     * Change handler called with current card number argument
     */
    onChange: PropTypes.func
  }

  static defaultProps = {
    hasError: false,
    defaultValue: '',
    defaultIsLastFour: false
  }

  constructor(props) {
    super(props)
    this.state = {
      cardNumber: this.props.defaultValue,
      cardType:
        this.props.defaultCardType ||
        CreditCardInformation.determineCardType(
          this.props.defaultValue,
          this.props.acceptedCardTypeInfo
        ),
      blurred: false
    }
  }

  handleChange = event => {
    const { value } = event.target
    this.setState(
      {
        cardNumber: value,
        cardType: CreditCardInformation.determineCardType(value)
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(this.state.cardNumber)
        }
      }
    )
  }

  handleBlur = () => {
    this.setState({ blurred: true }, () => {
      if (this.props.onBlur) {
        this.props.onBlur()
      }
    })
  }

  render() {
    const { classes, acceptedCardTypeInfo } = this.props
    const { cardNumber, blurred } = this.state
    const errorCode = CreditCardInformation.validateCard(cardNumber, acceptedCardTypeInfo)
    const hasError = blurred && errorCode !== ValidationResult.VALID
    return (
      <FormControl className={classes.root} error={hasError}>
        <InputLabel className={classes.label}>Card Number</InputLabel>
        <Input
          autoComplete={ccNumber}
          value={cardNumber}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          inputComponent={CreditCardNumberMask}
          autoCorrect="off"
          className={classnames(classes.input)}
          name="cardNumber"
          type="tel"
          isRequired
          endAdornment={
            <InputAdornment position="start">
              <CardIcon type={get(this.state, 'cardType.typeName', null)} />
            </InputAdornment>
          }
        />
        {hasError && (
          <FormHelperText>
            {CreditCardInformation.getErrorMessage(cardNumber, errorCode)}
          </FormHelperText>
        )}
      </FormControl>
    )
  }
}

export default CreditCardNumberInput
