import React from 'react'
import { IconButton } from '@material-ui/core'
import { Search } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

export const styles = theme => ({
  icon: {
    color: theme.palette.action.active,
  },
  large: {
    fontSize: '28px',
  },
})

const useStyles = makeStyles(styles, { name: 'RSFSearchButton' })

export default function SearchButton({ children, classes, search, ...other }) {
  classes = useStyles({ classes })

  return (
    <IconButton aria-label="Search" color="inherit" classes={{ label: classes.large }} {...other}>
      {children || <Search className={classes.icon} />}
    </IconButton>
  )
}
