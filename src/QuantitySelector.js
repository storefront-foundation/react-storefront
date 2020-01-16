import React from 'react'
import { Add, Remove } from '@material-ui/icons'
import { IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import clsx from 'clsx'

export const styles = theme => ({
  root: {
    backgroundColor: theme.palette.divider,
    border: 'none',
    width: '110px',
    padding: 0,
  },
  icon: {
    fontSize: '1.3125rem',
    position: 'relative',
  },
  button: {
    height: '36px',
    width: '36px',
    padding: 0,
  },
  subtract: { marginRight: theme.spacing(-4.5) },
  add: { marginLeft: theme.spacing(-4.5) },
  input: {
    width: 100,
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.grey[200],
    textAlign: 'center',
    padding: theme.spacing(1, 0, 1, 0),
    border: 'none',
    fontSize: theme.spacing(2),
    outline: 'none',
  },
  focused: {
    backgroundColor: theme.palette.divider,
  },
  underline: {
    '&::before': {
      display: 'none',
    },
  },
})

const useStyles = makeStyles(styles, { name: 'RSFQuantitySelector' })

/**
 * A quantity selector with plus and minus buttons.
 */
export default function QuantitySelector({
  name,
  classes,
  addIcon,
  addButtonProps,
  subtractIcon,
  subtractButtonProps,
  value,
  minValue,
  maxValue,
  onChange,
  inputProps,
  ariaLabel,
}) {
  classes = useStyles({ classes })
  const { quantitySelector, icon, button, ...inputClasses } = classes

  if (!value) value = 1

  function handleChange(value) {
    if (value >= minValue && value <= maxValue) {
      onChange(value)
    }
  }

  return (
    <>
      <IconButton
        size="small"
        classes={{ root: button }}
        className={classes.subtract}
        onClick={() => handleChange(value - 1)}
        aria-label={`add one ${ariaLabel}`}
        {...subtractButtonProps}
      >
        {subtractIcon || <Remove classes={{ root: icon }} />}
      </IconButton>
      <input
        onChange={handleChange}
        value={value}
        name={name}
        {...{ 'aria-label': ariaLabel }}
        className={clsx([classes.input, classes.underline, inputClasses])}
        {...inputProps}
        readOnly
      />
      <IconButton
        size="small"
        classes={{ root: button }}
        className={classes.add}
        onClick={() => handleChange(value + 1)}
        aria-label={`subtract one ${ariaLabel}`}
        {...addButtonProps}
      >
        {addIcon || <Add classes={{ root: icon }} />}
      </IconButton>
    </>
  )
}

QuantitySelector.propTypes = {
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
   * The accessibility label.  Add and subtract button aria-label values are derived from this as "add one {ariaLabel}" and "subtract one {ariaLabel}"
   */
  ariaLabel: PropTypes.string,
}

QuantitySelector.defaultProps = {
  name: 'quantity',
  onChange: Function.prototype,
  addButtonProps: {},
  subtractButtonProps: {},
  inputProps: {},
  minValue: 1,
  maxValue: 100,
  ariaLabel: 'quantity',
}
