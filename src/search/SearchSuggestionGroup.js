import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import SearchSuggestionItem from './SearchSuggestionItem'

export const styles = theme => ({
  /**
   * Styles applied to the root element.
   */
  root: {
    listStyle: 'none',
    margin: theme.spacing(2),
    '& a strong': {
      fontWeight: 'bold',
      color: 'inherit',
    },
  },
  /**
   * Styles applied to the group's caption element.
   */
  caption: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    paddingBottom: 5,
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: theme.spacing(0, 0, 1, 0),
  },
  /**
   * Styles applied to the group's list element.
   */
  list: {
    '&[data-ui=list]': {
      padding: 0,
      margin: theme.spacing(0, 0, 4, 0),
    },
    '&[data-ui=thumbnails]': {
      display: 'flex',
      listStyle: 'none',
      margin: '0 -15px',
      padding: '0 10px',
      overflowX: 'auto',
      '& > li': {
        margin: '5px',
      },
    },
  },
})

const useStyles = makeStyles(styles, { name: 'RSFSearchSuggestionGroup' })

export default function SearchSuggestionGroup({ classes, ui, caption, links, children }) {
  classes = useStyles({ classes })

  return (
    <div className={classes.root}>
      <Typography className={classes.caption}>{caption}</Typography>
      <ul className={classes.list} data-ui={ui}>
        {children
          ? children
          : links.map((item, i) => <SearchSuggestionItem item={item} ui={ui} key={i} />)}
      </ul>
    </div>
  )
}

SearchSuggestionGroup.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,
  /**
   * Child nodes that can be used for the suggestion group instead of mapping the [links](#prop-links).
   */
  children: PropTypes.node,
  /**
   * An array of props to pass to a [SearchSuggestionItem](/apiReference/search/SearchSuggestionItem)
   * with data for suggested searches.
   */
  links: PropTypes.arrayOf(
    PropTypes.shape({
      as: PropTypes.string,
      href: PropTypes.string,
      text: PropTypes.string,
      pageData: PropTypes.object,
      thumbnail: PropTypes.object,
    }),
  ),
  /**
   * A title for the list.
   */
  caption: PropTypes.string.isRequired,
}

SearchSuggestionGroup.defaultProps = {}
