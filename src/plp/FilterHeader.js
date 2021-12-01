import React, { useMemo, useContext } from 'react'
import { Hbox } from '../Box'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import SearchResultsContext from './SearchResultsContext'

const styles = theme => ({
  /**
   * Styles applied to the root element.
   */
  header: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.down('sm')]: {
      padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
    },
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(1, 2, 2, 2),
    },
  },
  /**
   * Styles applied to the title element.
   */
  title: {
    [theme.breakpoints.down('sm')]: {
      ...theme.typography.h6,
    },
    [theme.breakpoints.up('sm')]: {
      flex: 1,
      textTransform: 'uppercase',
      fontWeight: 'bold',
    },
  },
  /**
   * Styles applied to the clear link.
   */
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

/**
 * A header to be placed at the top of the [`Filter`](/apiReference/plp/Filter).
 */
export default function FilterHeader(props) {
  const { title, clearLinkText, hideClearLink, submitOnChange } = props
  const classes = useStyles(props.classes)
  const {
    actions,
    pageData: { filters },
  } = useContext(SearchResultsContext)

  return useMemo(
    () => (
      <Hbox justify="center" className={classes.header}>
        <div className={classes.title}>{title}</div>
        {hideClearLink || !filters || filters.length === 0 ? null : (
          <button onClick={() => actions.clearFilters(submitOnChange)} className={classes.clear}>
            {clearLinkText}
          </button>
        )}
      </Hbox>
    ),
    [filters, ...Object.values(props)],
  )
}

FilterHeader.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,
  /**
   * An optional title to display at the top of the component.
   */
  title: PropTypes.string,
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
}

FilterHeader.defaultProps = {
  title: 'Filter By',
  clearLinkText: 'clear all',
}
