import React from 'react'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'

const PREFIX = 'RSFSearchHeader'

const defaultClasses = {
  root: `${PREFIX}-root`,
}

const Root = styled('div')(({ theme }) => ({
  /**
   * Styles applied to the root element.
   */
  [`&.${defaultClasses.root}`]: {
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(6, 2, 2, 2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
}))

export {}

/**
 * A element to be placed at the top of a [SearchDrawer](/apiReference/search/SearchDrawer).
 */
export default function SearchHeader({ classes: c = {}, children }) {
  const classes = { ...defaultClasses, ...c }
  return <Root className={classes.root}>{children}</Root>
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
