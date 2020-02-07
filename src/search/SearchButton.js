import PropTypes from 'prop-types'
import React from 'react'
import { IconButton } from '@material-ui/core'
import { Search } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

export const styles = theme => ({
  /**
   * Styles applied to the icon, if [children](#prop-children) is empty.
   */
  icon: {
    color: theme.palette.action.active,
  },
  /**
   * Styles applied to the element containing the button's label.
   */
  large: {
    fontSize: '28px',
  },
})

const useStyles = makeStyles(styles, { name: 'RSFSearchButton' })

/**
 * A button that can be used to open a search drawer.
 */
export default function SearchButton({ children, classes, ...other }) {
  classes = useStyles({ classes })

  return (
    <IconButton aria-label="Search" color="inherit" classes={{ label: classes.large }} {...other}>
      {children || <Search className={classes.icon} />}
    </IconButton>
  )
}

SearchButton.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * Optional content to use for the button contents. If empty, a search icon is used.
   */
  children: PropTypes.node,
}
