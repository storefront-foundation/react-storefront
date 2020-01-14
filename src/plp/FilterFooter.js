import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Typography } from '@material-ui/core'
import { Hbox } from '../Box'
import SearchResultsContext from './SearchResultsContext'

export const styles = theme => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
    padding: '12px 20px',
    color: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemsFound: {
    color: theme.palette.secondary.contrastText,
  },
})

const useStyles = makeStyles(styles, { name: 'RSFFilterFooter' })

export default function FilterFooter(props) {
  let { classes, submitOnChange, onViewResultsClick } = props
  classes = useStyles({ classes })

  const {
    pageData: { filters, filtersChanged },
  } = useContext(SearchResultsContext)

  if (!filters || !filtersChanged || submitOnChange) return null

  return (
    <Hbox className={classes.root} justify="space-between">
      <Typography variant="subtitle1" className={classes.itemsFound}>
        {filters.length || 'No'} filter
        {filters.length === 1 ? '' : 's'} selected
      </Typography>
      <Button variant="contained" size="large" color="default" onClick={onViewResultsClick}>
        View Results
      </Button>
    </Hbox>
  )
}
