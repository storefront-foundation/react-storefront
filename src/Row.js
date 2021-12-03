import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'
import React from 'react'
const PREFIX = 'Row'

const defaultClasses = {
  root: `${PREFIX}-root`,
}

const Root = styled('div')(({ theme }) => ({
  /**
   * Styles applied to the root element.
   */
  [`&.${defaultClasses.root}`]: {
    margin: `0 0 ${theme.spacing(2)} 0`,
  },
}))

/**
 * A grid item that takes up the full viewport.  Provided for backwards compatibility with
 * React Storefront 6.
 */
export default function Row({ children, classes: c = {}, ...others }) {
  const classes = { ...defaultClasses, ...c }

  return (
    <Root className={classes.root} {...others}>
      {children}
    </Root>
  )
}

Row.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,
}
