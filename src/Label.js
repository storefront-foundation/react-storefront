import PropTypes from 'prop-types'
import React from 'react'
import clsx from 'clsx'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const styles = theme => ({
  /**
   * Styles applied to the root element\.
   */
  root: {
    fontWeight: 500,
    marginRight: 10,
  },
})

const useStyles = makeStyles(styles, { name: 'RSFLabel' })

export default function Label({ classes, className, ...props }) {
  classes = useStyles({ classes })
  return <Typography {...props} className={clsx(className, classes.root)} />
}

Label.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,
  /**
   * CSS class to apply to the root element
   */
  className: PropTypes.string,
}
