import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

export const styles = theme => ({
  /**
   * Styles applied to the root element.
   */
  root: {
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(6, 2, 2, 2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
})

const useStyles = makeStyles(styles, { name: 'RSFSearchHeader' })

/**
 * A element to be placed at the top of a [SearchDrawer](/apiReference/search/SearchDrawer).
 */
export default function SearchHeader({ classes, children }) {
  classes = useStyles({ classes })
  return <div className={classes.root}>{children}</div>
}

SearchHeader.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * Children to be rendered inside the header.
   */
  children: PropTypes.node,
}

SearchHeader.defaultProps = {}
