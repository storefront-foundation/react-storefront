import React, { useState, useEffect, useContext } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import SearchSuggestionItem from './SearchSuggestionItem'

export const styles = theme => ({
  root: {
    listStyle: 'none',
    margin: theme.spacing(2),
    '& a strong': {
      fontWeight: 'bold',
      color: 'inherit',
    },
  },
  caption: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    paddingBottom: 5,
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: theme.spacing(0, 0, 1, 0),
  },
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
   * An array of links to suggested searches.
   */
  links: PropTypes.array,
  /**
   * A title for the list
   */
  caption: PropTypes.string.isRequired,
}

SearchSuggestionGroup.defaultProps = {}
