import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import SearchSuggestionGroup from './SearchSuggestionGroup'
import SearchContext from './SearchContext'
import LoadMask from '../LoadMask'
import PropTypes from 'prop-types'

export const styles = theme => ({
  /**
   * Styles applied to the root element.
   */
  root: {
    flex: 1,
    position: 'relative',
    overflowY: 'auto',
  },
  /**
   * Styles applied to each of the group wrapper elements.
   */
  group: {
    margin: theme.spacing(0, 0, 2, 0),
  },
})
const useStyles = makeStyles(styles, { name: 'RSFSearchSuggestions' })

export default function SearchSuggestions({ classes }) {
  classes = useStyles({ classes })
  const { state } = useContext(SearchContext)

  return (
    <>
      <LoadMask show={state.loading} transparent />
      <div className={classes.root}>
        {state.groups &&
          state.groups.map((group, i) => (
            <div key={i} className={classes.group}>
              <SearchSuggestionGroup {...group} />
            </div>
          ))}
      </div>
    </>
  )
}

SearchSuggestions.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,
}

SearchSuggestions.defaultProps = {}
