import React from 'react'
import clsx from 'clsx'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const styles = theme => ({
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
