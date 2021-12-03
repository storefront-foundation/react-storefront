import React, { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { IconButton } from '@mui/material'
import PropTypes from 'prop-types'

const PREFIX = 'RSFToolbarButton'

const defaultClasses = {
  wrap: `${PREFIX}-wrap`,
}

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  /**
   * Styles applied to the content wrapper element inside the button
   */
  [`& .${defaultClasses.wrap}`]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.typography.caption,
  },
}))

export {}

/**
 * A toolbar button with optional label.  Use these in your AppBar. All additional
 * props are spread to the underlying mui IconButton.
 */
const ToolbarButton = forwardRef(({ icon, label, children, classes: c = {}, ...others }, ref) => {
  const classes = { ...defaultClasses, ...c }
  let { wrap, ...buttonClasses } = classes

  return (
    <StyledIconButton ref={ref} classes={buttonClasses} {...others} size="large">
      <div className={classes.wrap}>
        {icon}
        <div>{label}</div>
      </div>
      {children}
    </StyledIconButton>
  )
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
