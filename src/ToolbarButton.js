import React, { forwardRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { IconButton } from '@material-ui/core'
import PropTypes from 'prop-types'

export const styles = theme => ({
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
 * props are spread to the underlying material-ui IconButton.
 */
// export default function ToolbarButton({ icon, label, classes, children, ...others }) {

const ToolbarButton = forwardRef(({ icon, label, classes = {}, children, ...others }, ref) => {
  let { wrap, ...buttonClasses } = classes
  classes = useStyles({ classes: { wrap } })

  return (
    <IconButton ref={ref} classes={buttonClasses} {...others}>
      <div className={classes.wrap}>
        {icon}
        <div>{label}</div>
      </div>
      {children}
    </IconButton>
  )
})

ToolbarButton.propTypes = {
  /**
   * The icon
   */
  icon: PropTypes.element,

  /**
   * The label text (optional)
   */
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
}

export default ToolbarButton
