import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

export const styles = theme => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(6, 2, 2, 2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
})

const useStyles = makeStyles(styles, { name: 'RSFSearchHeader' })

export default function SearchHeader({ classes, children }) {
  classes = useStyles({ classes })
  return <div className={classes.root}>{children}</div>
}

SearchHeader.propTypes = {}

SearchHeader.defaultProps = {}
