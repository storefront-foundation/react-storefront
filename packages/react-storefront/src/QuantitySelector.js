/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Fragment, Component } from 'react'
import Add from '@material-ui/icons/Add'
import Remove from '@material-ui/icons/Remove'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'

export const styles = theme => ({
  root: {
    backgroundColor: theme.palette.divider,
    border: 'none',
    width: '110px',
    padding: 0
  },
  icon: {
    fontSize: theme.typography.title.fontSize,
    position: 'relative'
  },
  button: {
    height: '36px',
    width: '36px',
    padding: 0
  },
  input: {
    color: theme.typography.body1.color,
    textAlign: 'center',
    padding: 0
  },
  focused: {
    backgroundColor: theme.palette.divider
  },
  underline: {
    '&::before': {
      display: 'none'
    }
  }
})

/**
 * A quantity selector with plus and minus buttons. Any extra props are spread to the
 * underlying Material UI input element.
 */
@inject(({ app, ampStateId }) => ({ app, ampStateId }))
@withStyles(styles, { name: 'RSFQuantitySelector' })
@observer
export default class QuantitySelector extends Component {
  static propTypes = {
    /**
     * The name to apply to the input when rendering AMP.
     */
    name: PropTypes.string,

    /**
     * CSS classes
     */
    classes: PropTypes.object,

    /**
     * The plus icon
     */
    addIcon: PropTypes.element,

    /**
     * The minus icon
     */
    subtractIcon: PropTypes.element,

    /**
     * The current value
     */
    value: PropTypes.number,

    /**
     * The minimum value.  Defaults to 1.
     */
    minValue: PropTypes.number,

    /**
     * The maximum value.  Defaults to 100.
     */
    maxValue: PropTypes.number,

    /**
     * Called when the value is changed.  The new value is passed as the only argument
     */
    onChange: PropTypes.func,

    /**
     * If specified, this component will automatically control the price of a product.
     * This should be an instance of ProductModelBase
     */
    product: PropTypes.object,

    /**
     * The accessibility label.  Add and subtract button aria-label values are derived from this as "add one {ariaLabel}" and "subtract one {ariaLabel}"
     */
    ariaLabel: PropTypes.string
  }

  static defaultProps = {
    name: 'quantity',
    onChange: Function.prototype,
    minValue: 1,
    maxValue: 100,
    value: 1,
    ariaLabel: 'quantity'
  }

  render() {
    let {
      name,
      app,
      classes,
      addIcon,
      subtractIcon,
      value,
      minValue,
      maxValue,
      analytics,
      product,
      inputProps,
      ampStateId,
      ariaLabel,
      ...other
    } = this.props

    if (product) {
      value = product.quantity
    }

    const { quantitySelector, icon, button, ...inputClasses } = classes

    const bindProps = {
      inputProps: {
        'aria-label': ariaLabel,
        name,
        ...inputProps,
        'amp-bind': `value=>${ampStateId}.quantity`
      },
      [app.amp ? 'readOnly' : 'disabled']: true
    }

    return (
      <Fragment>
        <Input
          startAdornment={
            <IconButton
              size="small"
              classes={{ root: button }}
              onClick={() => this.onChange(value - 1)}
              aria-label={`add one ${ariaLabel}`}
              on={`tap:AMP.setState({ ${ampStateId}: { quantity: max(${minValue}, (${ampStateId}.quantity || ${value}) - 1) } })`}
            >
              {subtractIcon || <Remove classes={{ root: icon }} />}
            </IconButton>
          }
          endAdornment={
            <IconButton
              size="small"
              classes={{ root: button }}
              onClick={() => this.onChange(value + 1)}
              aria-label={`subtract one ${ariaLabel}`}
              on={`tap:AMP.setState({ ${ampStateId}: { quantity: min(${maxValue}, (${ampStateId}.quantity || ${value}) + 1) } })`}
            >
              {addIcon || <Add classes={{ root: icon }} />}
            </IconButton>
          }
          onChange={this.onChange}
          value={value}
          classes={{
            underline: classes.underline,
            ...inputClasses
          }}
          {...bindProps}
          {...other}
        />
      </Fragment>
    )
  }

  onChange = value => {
    const { minValue, maxValue, product } = this.props

    if (value >= minValue && value <= maxValue) {
      this.props.onChange(value)

      if (product) {
        product.setQuantity(value)
      }
    }
  }
}
