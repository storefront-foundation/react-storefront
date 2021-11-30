import React, { useContext, memo } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/material/styles'
import FacetGroup from './FacetGroup'
import FilterHeader from './FilterHeader'
import FilterFooter from './FilterFooter'
import SearchResultsContext from './SearchResultsContext'

export const styles = theme => ({
  /**
   * Styles applied to the root element.
   */
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  /**
   * Styles applied to the wrapper element around the facet groups.
   */
  facetGroups: {
    overflow: 'auto',
    overflowX: 'hidden',
    flex: '1',
    position: 'relative',
  },
})

const useStyles = makeStyles(styles, { name: 'RSFFilter' })

/**
 * UI for filtering a list of products.  This component can be used on its own, or you can use
 * [`FilterButton`](/apiReference/plp/FilterButton) to automatically display this component in a
 * drawer that slides up from the bottom of the viewport.
 */
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
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * A function to call when the user clicks the button to view updated results.  The default behavior can be
   * canceled by calling `preventDefault` on the passed in event.  The event is passed as the only argument.
   */
  onViewResultsClick: PropTypes.func,

  /**
   * The query string parameter that should be updated when filters are changed.  The value will be an array
   * of codes for each selected facet.
   */
  queryParam: PropTypes.string,

  /**
   * An optional title to display at the top of the component.
   */
  title: PropTypes.string,

  /**
   * Set to `true` to expand all groups on initial render.
   */
  expandAll: PropTypes.bool,

  /**
   * Set to `true` to refresh the results when the user toggles a filter.
   */
  submitOnChange: PropTypes.bool,

  /**
   * If `true`, the clear link is hidden.
   */
  hideClearLink: PropTypes.bool,

  /**
   * Text to use for the clear link.
   */
  clearLinkText: PropTypes.string,

  /**
   * CSS styles to add to the root component.
   */
  style: PropTypes.object,
}

Filter.defaultProps = {
  onViewResultsClick: Function.prototype,
  submitOnChange: false,
}

export default memo(Filter)
