import PropTypes from 'prop-types'
import React from 'react'
import { makeStyles } from '@mui/material/styles'

const useStyles = makeStyles(theme => ({
  /**
   * Styles applied to the root element.
   */
  root: {
    margin: `0 0 ${theme.spacing(2)} 0`,
  },
}))

/**
 * A grid item that takes up the full viewport.  Provided for backwards compatibility with
 * React Storefront 6.
 */
export default function Row({ children, classes, ...others }) {
  classes = useStyles({ classes })

  return (
    <div className={classes.root} {...others}>
      {children}
    </div>
  )
}

Row.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,
}
