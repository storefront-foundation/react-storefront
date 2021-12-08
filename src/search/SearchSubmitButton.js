import SearchIcon from '@mui/icons-material/Search'
import { styled } from '@mui/material/styles'
import React from 'react'
import PropTypes from 'prop-types'

const PREFIX = 'RSFSearchSubmitButton'

const classes = {
  root: `${PREFIX}-root`,
  label: `${PREFIX}-label`,
}

/**
 * A button to submit the search.  All other props are spread to the provided `Component`.
 */
export default function SearchSubmitButton({ Component, ButtonIcon, text, ...others }) {
  const StyledComponent = styled(Component)(() => ({
    /**
     * Styles applied to the root element.
     */
    [`&.${classes.root}`]: {},

    /**
     * Styles applied to the label element.
     */
    [`& .${classes.label}`]: {
      display: 'flex',
    },
  }))

  return (
    <StyledComponent
      rel="search"
      type="submit"
      className={classes.root}
      classes={{ label: classes.label }}
      disabled={text.trim().length === 0}
      {...others}
    >
      <ButtonIcon />
    </StyledComponent>
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
