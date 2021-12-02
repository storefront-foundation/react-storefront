import React from 'react'
import { styled } from '@mui/material/styles';
import { Add, Remove } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import PropTypes from 'prop-types'
import clsx from 'clsx'

const PREFIX = 'RSFQuantitySelector';

const classes = {
  root: `${PREFIX}-root`,
  icon: `${PREFIX}-icon`,
  button: `${PREFIX}-button`,
  subtract: `${PREFIX}-subtract`,
  add: `${PREFIX}-add`,
  input: `${PREFIX}-input`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  /**
   * Styles applied to the root element.
   */
  [`& .${classes.root}`]: {
    backgroundColor: theme.palette.divider,
    border: 'none',
    width: '110px',
    padding: 0,
  },

  /**
   * Styles applied to the icon elements.
   */
  [`& .${classes.icon}`]: {
    fontSize: '1.3125rem',
    position: 'relative',
  },

  /**
   * Styles applied to the icon button elements.
   */
  [`& .${classes.button}`]: {
    height: '36px',
    width: '36px',
    padding: 0,
  },

  /**
   * Styles applied to the subtract icon button element.
   */
  [`& .${classes.subtract}`]: { marginRight: theme.spacing(-4.5) },

  /**
   * Styles applied to the add icon button element.
   */
  [`& .${classes.add}`]: { marginLeft: theme.spacing(-4.5) },

  /**
   * Styles applied to the text input element.
   */
  [`& .${classes.input}`]: {
    width: 100,
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.grey[200],
    textAlign: 'center',
    padding: theme.spacing(1, 0, 1, 0),
    border: 'none',
    fontSize: theme.spacing(2),
    outline: 'none',
    '&::before': {
      display: 'none',
    },
  }
}));

export {};

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

  const { quantitySelector, icon, button, ...inputClasses } = classes

  if (!value) value = 1

  function handleChange(value) {
    if (value >= minValue && value <= maxValue) {
      onChange(value)
    }
  }

  return (
    (<Root>
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
        className={clsx([classes.input, inputClasses])}
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
    </Root>)
  );
}

QuantitySelector.propTypes = {
  /**
   * The name to apply to the input when rendering AMP.
   */
  name: PropTypes.string,

  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * The plus icon.
   */
  addIcon: PropTypes.element,

  /**
   * The minus icon.
   */
  subtractIcon: PropTypes.element,

  /**
   * The current value.
   */
  value: PropTypes.number,

  /**
   * The minimum value.
   */
  minValue: PropTypes.number,

  /**
   * The maximum value.
   */
  maxValue: PropTypes.number,

  /**
   * Called when the value is changed.  The new value is passed as the only argument
   */
  onChange: PropTypes.func,

  /**
   * The accessibility label.  Add and subtract button `aria-label` values are derived from this as
   * `"add one {ariaLabel}"` and `"subtract one {ariaLabel}"`.
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
