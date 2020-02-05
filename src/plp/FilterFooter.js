import PropTypes from 'prop-types'
import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Typography } from '@material-ui/core'
import { Hbox } from '../Box'
import SearchResultsContext from './SearchResultsContext'

export const styles = theme => ({
  /**
   * Styles applied to the root element.
   */
  root: {
    backgroundColor: theme.palette.secondary.main,
    padding: '12px 20px',
    color: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  /**
   * Styles applied to the "# items found" label.
   */
  itemsFound: {
    color: theme.palette.secondary.contrastText,
  },
})

const useStyles = makeStyles(styles, { name: 'RSFFilterFooter' })

/**
 * A footer to be placed at the bottom of the [`Filter`](/apiReference/plp/Filter).
 */
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

FilterFooter.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * Set to `true` if the filters will be submitted when changed. In this case, the footer will not be shown.
   */
  submitOnChange: PropTypes.bool,

  /**
   * Function to call when the "View Results" button is clicked.
   */
  onViewResultsClick: PropTypes.func,
}
