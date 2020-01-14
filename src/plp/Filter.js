import React, { useContext, memo } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import FacetGroup from './FacetGroup'
import FilterHeader from './FilterHeader'
import FilterFooter from './FilterFooter'
import SearchResultsContext from './SearchResultsContext'

/**
 * UI for filtering an instance of SearchResultModelBase.  This component can be used on its own, or you can use
 * FilterButton to automatically display this component in a drawer that slides up from the bottom of the viewport.
 */
export const styles = theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  facetGroups: {
    overflow: 'auto',
    overflowX: 'hidden',
    flex: '1',
    position: 'relative',
  },
})

const useStyles = makeStyles(styles, { name: 'RSFFilter' })

function Filter({
  expandAll,
  hideClearLink,
  clearLinkText,
  submitOnChange,
  style,
  classes,
  title,
  onViewResultsClick,
}) {
  classes = useStyles({ classes })

  const {
    pageData: { facets },
  } = useContext(SearchResultsContext)

  return (
    <div style={style} className={classes.root}>
      <FilterHeader
        hideClearLink={hideClearLink}
        clearLinkText={clearLinkText}
        title={title}
        submitOnChange={submitOnChange}
      />
      <div className={classes.facetGroups}>
        {facets &&
          facets.map((group, i) => (
            <FacetGroup
              group={group}
              key={i}
              defaultExpanded={expandAll}
              submitOnChange={submitOnChange}
            />
          ))}
      </div>
      <FilterFooter onViewResultsClick={onViewResultsClick} submitOnChange={submitOnChange} />
    </div>
  )
}

Filter.propTypes = {
  /**
   * CSS classes
   */
  classes: PropTypes.object,

  /**
   * A function to call when the user clicks the button to view updated results.  The default behavior can be
   * canceled by calling `preventDefault` on the passed in event.  The event is passed as the only argument.
   */
  onViewResultsClick: PropTypes.func,

  /**
   * The query string parameter that should be updated when filters are changed.  The value will be an array
   * of codes for each selected facet.  Defaults to "filters"
   */
  queryParam: PropTypes.string,

  /**
   * An optional title to display at the top of the component.
   */
  title: PropTypes.string,

  /**
   * Set to `true` to expand all groups on initial render
   */
  expandAll: PropTypes.bool,

  /**
   * Set to `true` to refresh the results when the user toggles a filter
   */
  submitOnChange: PropTypes.bool,
}

Filter.defaultProps = {
  onViewResultsClick: Function.prototype,
  submitOnChange: false,
}

export default memo(Filter)
