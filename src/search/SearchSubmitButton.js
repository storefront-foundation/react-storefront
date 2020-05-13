import SearchIcon from '@material-ui/icons/Search'
import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import PropTypes from 'prop-types'

export const styles = theme => ({
  /**
   * Styles applied to the root element.
   */
  root: {},
  /**
   * Styles applied to the label element.
   */
  label: {
    display: 'flex',
  },
})
const useStyles = makeStyles(styles, { name: 'RSFSearchSubmitButton' })

/**
 * A button to submit the search.  All other props are spread to the provided `Component`.
 */
export default function SearchSubmitButton({ Component, ButtonIcon, classes, text, ...others }) {
  classes = useStyles({ classes })

  return (
    <Component
      rel="search"
      type="submit"
      className={classes.root}
      classes={{ label: classes.label }}
      disabled={text.trim().length === 0}
      {...others}
    >
      <ButtonIcon />
    </Component>
  )
}

SearchSubmitButton.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,
  /**
   * A Material UI button component to display.
   */
  Component: PropTypes.elementType.isRequired,
  /**
   * A Material UI button component to display.
   */
  ButtonIcon: PropTypes.elementType,
  /**
   * The current search text.
   */
  text: PropTypes.string.isRequired,
}

SearchSubmitButton.defaultProps = {
  ButtonIcon: SearchIcon,
}
