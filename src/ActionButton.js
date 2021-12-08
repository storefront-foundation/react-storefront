import React, { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { Button, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const PREFIX = 'RSFActionButton'

const defaultClasses = {
  label: `${PREFIX}-label`,
  caption: `${PREFIX}-caption`,
  button: `${PREFIX}-button`,
  value: `${PREFIX}-value`,
}

const StyledButton = styled(Button)(({ theme }) => ({
  /**
   * Styles passed through to the [`Button`](https://mui.com/api/button/#css) element's
   * `label` CSS rule.
   */
  [`& .${defaultClasses.label}`]: {
    justifyContent: 'space-between',
    alignItems: 'baseline',
    textTransform: 'none',
  },

  /**
   * Styles applied to the label container.
   */
  [`& .${defaultClasses.caption}`]: {
    textTransform: 'none',
    fontWeight: 'bold',
  },

  /**
   * Styles passed through to the [`Button`](https://mui.com/api/button/#css) element's
   * `contained` CSS rule.
   */
  [`& .${defaultClasses.button}`]: {
    boxShadow: 'none',
    backgroundColor: theme.palette.grey[200],
  },

  /**
   * Styles applied to the values container.
   */
  [`& .${defaultClasses.value}`]: {
    color: theme.palette.text.primary,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipses',
    marginLeft: '10px',
  },
}))

export {}

/**
 * This button class displays a label and value.
 *
 * Example:
 *
 * ```js
 *  <ActionButton label="Sort" value="Lowest Price" onClick={openSortMenu} />
 * ```
 */
const ActionButton = forwardRef(({ label, value, classes: c = {}, ...props }, ref) => {
  const classes = { ...defaultClasses, ...c }
  const { caption, value: valueClasses, button, label: labelClasses, ...otherClasses } = classes
  return (
    <StyledButton
      ref={ref}
      variant="contained"
      color="primary"
      classes={{
        contained: button,
        label: labelClasses,
        ...otherClasses,
      }}
      {...props}
    >
      <Typography variant="button" className={caption}>
        {label}
      </Typography>
      <Typography variant="caption" className={valueClasses}>
        {value}
      </Typography>
    </StyledButton>
  )
})

ActionButton.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * The label to display on the left side of the button.
   */
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

  /**
   * The value to display on the right side of the button.
   */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
}

export default ActionButton
