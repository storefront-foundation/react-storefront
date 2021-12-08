import React from 'react'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import PropTypes from 'prop-types'
import SearchSuggestionItem from './SearchSuggestionItem'

const PREFIX = 'RSFSearchSuggestionGroup'

const defaultClasses = {
  root: `${PREFIX}-root`,
  caption: `${PREFIX}-caption`,
  list: `${PREFIX}-list`,
}

const Root = styled('div')(({ theme }) => ({
  /**
   * Styles applied to the root element.
   */
  [`&.${defaultClasses.root}`]: {
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
  [`& .${defaultClasses.caption}`]: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    paddingBottom: 5,
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: theme.spacing(0, 0, 1, 0),
  },

  /**
   * Styles applied to the group's list element.
   */
  [`& .${defaultClasses.list}`]: {
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
}))

export {}

export default function SearchSuggestionGroup({ classes: c = {}, ui, caption, links, children }) {
  const classes = { ...defaultClasses, ...c }

  return (
    <Root className={classes.root}>
      <Typography className={classes.caption}>{caption}</Typography>
      <ul className={classes.list} data-ui={ui}>
        {children || links.map((item, i) => <SearchSuggestionItem item={item} ui={ui} key={i} />)}
      </ul>
    </Root>
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
  ui: PropTypes.any,
}

SearchSuggestionGroup.defaultProps = {}
