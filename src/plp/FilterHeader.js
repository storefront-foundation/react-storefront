import React, { useMemo, useContext } from 'react'
import { Hbox } from '../Box'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import SearchResultsContext from './SearchResultsContext'

const styles = theme => ({
  header: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.down('xs')]: {
      padding: `${theme.spacing(2)}px ${theme.spacing(4)}px`,
    },
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(1, 2, 2, 2),
    },
  },
  title: {
    [theme.breakpoints.down('xs')]: {
      ...theme.typography.h6,
    },
    [theme.breakpoints.up('sm')]: {
      flex: 1,
      textTransform: 'uppercase',
      fontWeight: 'bold',
    },
  },
  clear: {
    ...theme.typography.caption,
    display: 'block',
    border: 'none',
    padding: 0,
    marginLeft: '10px',
    textDecoration: 'underline',
    backgroundColor: 'transparent',
  },
})

const useStyles = makeStyles(styles, { name: 'RSFFilterHeader' })

export default function FilterHeader(props) {
  const { title, clearLinkText, hideClearLink, submitOnChange } = props
  const classes = useStyles()
  const {
    actions,
    pageData: { filters },
  } = useContext(SearchResultsContext)

  return useMemo(
    () => (
      <Hbox justify="center" className={classes.header}>
        <div className={classes.title}>{title}</div>
        {hideClearLink || !filters || filters.length === 0 ? null : (
          <button
            onClick={() => actions.clearFilters(submitOnChange)}
            className={clsx({
              [classes.clear]: true,
            })}
          >
            {clearLinkText}
          </button>
        )}
      </Hbox>
    ),
    [filters, ...Object.values(props)],
  )
}

FilterHeader.propTypes = {
  title: PropTypes.string,
  clearLinkText: PropTypes.string,
}

FilterHeader.defaultProps = {
  title: 'Filter By',
  clearLinkText: 'clear all',
}
