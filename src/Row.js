import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    margin: `0 0 ${theme.spacing(2)}px 0`,
  },
}))

/**
 * A grid item that takes up the full viewport.  Provided for backwards compabitibility with
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
