import React, { forwardRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Typography } from '@material-ui/core'
import PropTypes from 'prop-types'

export const styles = theme => ({
  /**
   * Styles passed through to the [`Button`](https://material-ui.com/api/button/#css) element's
   * `label` CSS rule.
   */
  label: {
    justifyContent: 'space-between',
    alignItems: 'baseline',
    textTransform: 'none',
  },
  /**
   * Styles applied to the label container.
   */
  caption: {
    textTransform: 'none',
    fontWeight: 'bold',
  },
  /**
   * Styles passed through to the [`Button`](https://material-ui.com/api/button/#css) element's
   * `contained` CSS rule.
   */
  button: {
    boxShadow: 'none',
    backgroundColor: theme.palette.grey[200],
  },
  /**
   * Styles applied to the values container.
   */
  value: {
    color: theme.palette.text.primary,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipses',
    marginLeft: '10px',
  },
})

const useStyles = makeStyles(styles, { name: 'RSFActionButton' })

/**
 * This button class displays a label and value.
 *
 * Example:
 *
 * ```js
 *  <ActionButton label="Sort" value="Lowest Price" onClick={openSortMenu} />
 * ```
 */
const ActionButton = forwardRef(({ label, value, children, classes = {}, ...props }, ref) => {
  let { caption, value: valueClasses, button, label: labelClasses, ...otherClasses } = classes
  classes = useStyles({ classes: { caption, value: valueClasses, button, label: labelClasses } })

  return (
    <Button
      ref={ref}
      variant="contained"
      classes={{
        contained: classes.button,
        label: classes.label,
        ...otherClasses,
      }}
      {...props}
    >
      <Typography variant="button" className={classes.caption}>
        {label}
      </Typography>
      <Typography variant="caption" className={classes.value}>
        {value}
      </Typography>
    </Button>
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
