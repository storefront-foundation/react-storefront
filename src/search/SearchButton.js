import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'
import React from 'react'
import { IconButton } from '@mui/material'
import { Search } from '@mui/icons-material'

const PREFIX = 'RSFSearchButton'

const defaultClasses = {
  icon: `${PREFIX}-icon`,
  large: `${PREFIX}-large`,
}

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  /**
   * Styles applied to the icon, if [children](#prop-children) is empty.
   */
  [`& .${defaultClasses.icon}`]: {
    color: theme.palette.action.active,
  },

  /**
   * Styles applied to the element containing the button's label.
   */
  [`& .${defaultClasses.large}`]: {
    fontSize: '28px',
  },
}))

export {}

/**
 * A button that can be used to open a search drawer.
 */
export default function SearchButton({ children, classes: c = {}, ...other }) {
  const classes = { ...defaultClasses, ...c }
  return (
    <StyledIconButton
      aria-label="Search"
      color="inherit"
      classes={{ label: classes.large }}
      {...other}
      size="large"
    >
      {children || <Search className={classes.icon} />}
    </StyledIconButton>
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
