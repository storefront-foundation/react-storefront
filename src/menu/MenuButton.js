import React from 'react'
import { styled } from '@mui/material/styles'
import { Hidden } from '@mui/material'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import ToolbarButton from '../ToolbarButton'
import MenuIcon from './MenuIcon'

const PREFIX = 'RSFMenuButton'

const classes = {
  link: `${PREFIX}-link`,
}

const StyledHidden = styled(Hidden)(() => ({
  [`& .${classes.link}`]: {
    textDecoration: 'none',
  },
}))

export {}

/**
 * The button that controls that opens and closes the main app menu.
 */
export default function MenuButton({ MenuIcon, menuIconProps, open, onClick, className, style }) {
  return (
    <StyledHidden mdUp implementation="css" key="menuButton">
      <a
        on="tap:AMP.setState({ rsfMenuState: { open: !rsfMenuState.open, list: '@' } }), rsfMenu.toggle"
        className={clsx(classes.link, className)}
        style={style}
      >
        <ToolbarButton
          aria-label="Menu"
          color="inherit"
          onClick={onClick}
          icon={<MenuIcon open={open} {...menuIconProps} />}
        />
      </a>
    </StyledHidden>
  )
}

MenuButton.propTypes = {
  /**
   * A react component to use for the menu icon
   */
  MenuIcon: PropTypes.elementType,

  /**
   * Props for the menu icon
   */
  menuIconProps: PropTypes.object,
  open: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
}

MenuButton.defaultProps = {
  MenuIcon,
  menuIconProps: {},
}
