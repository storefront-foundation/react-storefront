import PropTypes from 'prop-types'
import React from 'react'
import { makeStyles } from '@mui/styles'

/**
 * Renders a simple div with flex: 1 to be used as a spacer.  Since this is a
 * common case, the main purposed of this class is to minimize the amount of
 * css generated for an app.
 */
export const styles = theme => ({
  /**
   * Styles applied to the root element.
   */
  root: {
    flex: 1,
  },
})

const useStyles = makeStyles(styles, { name: 'RSFSpacer' })

/**
 * Renders a simple div with flex: 1 to be used as a spacer.  Since this is a
 * common case, the main purposed of this class is to minimize the amount of
 * css generated for an app.
 */
export default function Spacer(props) {
  const classes = useStyles(props)
  return <div className={classes.root} />
}

Spacer.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,
}
