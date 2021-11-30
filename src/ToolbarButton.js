import React, { forwardRef } from 'react'
import { makeStyles } from '@mui/material/styles'
import { IconButton } from '@mui/material'
import PropTypes from 'prop-types'

export const styles = theme => ({
  /**
   * Styles applied to the content wrapper element inside the button
   */
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.typography.caption,
  },
})

const useStyles = makeStyles(styles, { name: 'RSFToolbarButton' })

/**
 * A toolbar button with optional label.  Use these in your AppBar. All additional
 * props are spread to the underlying mui IconButton.
 */
const ToolbarButton = forwardRef(({ icon, label, classes = {}, children, ...others }, ref) => {
  let { wrap, ...buttonClasses } = classes
  classes = useStyles({ classes: { wrap } })

  return (
    <IconButton ref={ref} classes={buttonClasses} {...others} size="large">
      <div className={classes.wrap}>
        {icon}
        <div>{label}</div>
      </div>
      {children}
    </IconButton>
  );
})

ToolbarButton.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * The icon to use for the button.
   */
  icon: PropTypes.element,

  /**
   * The label text for the button.
   */
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
}

export default ToolbarButton
