/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import throttle from 'lodash/throttle'
import Toolbar from '@material-ui/core/Toolbar'
import { observer, inject } from 'mobx-react'
import Hidden from '@material-ui/core/Hidden'
import withStyles from '@material-ui/core/styles/withStyles'
import ToolbarButton from './ToolbarButton'
import MenuIcon from './MenuIcon'

export const styles = theme => ({
  root: {
    boxSizing: 'content-box',
    position: 'relative',
    zIndex: theme.zIndex.modal + 10,
  },

  withAmp: {
    zIndex: theme.zIndex.amp.modal + 1,
  },

  toolBar: {
    height: theme.headerHeight || '64px',
    padding: `0 7px`,
    maxWidth: theme.maxWidth,
    flex: 1,
  },

  wrap: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.palette.background.paper,
    zIndex: theme.zIndex.modal + 10,
    display: 'flex',
    justifyContent: 'center',
  },

  stuck: {
    transform: 'translateY(0)',
  },

  unstuck: {
    transform: 'translateY(-100%)',
  },

  animate: {
    transition: 'transform .15s ease-in',
  },

  hidden: {
    position: 'fixed',
    zIndex: theme.zIndex.modal + 10,
    boxShadow: theme.shadows[2],
    top: 0,
    left: 0,
    right: 0,
  },

  menuOpen: {
    boxShadow: 'none',
  },

  link: {
    textDecoration: 'none',
  },
})

/**
 * A header that auto hides when the user scrolls down and auto shows when the user
 * scrolls up. A hamburger button that controls the menu is automatically displayed on
 * the left side of the header.  Children are placed directly to the right of the menu
 * button.
 */
@inject(({ app }) => ({ menu: app.menu, amp: app.amp }))
@withStyles(styles, { name: 'RSFAppBar' })
@observer
export default class Header extends Component {
  state = {
    stuck: false,
    hidden: false,
    animate: false,
  }

  static propTypes = {
    /**
     * CSS classes
     */
    classes: PropTypes.object,

    /**
     * A component for the menu icon.
     */
    MenuIcon: PropTypes.func,

    /**
     * Additional props for the menu icon
     */
    menuIconProps: PropTypes.object,

    /**
     * Sets the alignment of the menu icon. "right" or "left".
     */
    menuAlign: PropTypes.oneOf(['left', 'right']),
  }

  static defaultProps = {
    MenuIcon,
    menuIconProps: {},
    menuAlign: 'left',
  }

  render() {
    const { MenuIcon, classes, children, fixed, menu, amp, menuAlign, menuIconProps } = this.props
    const items = React.Children.toArray(children)

    const menuButton = (
      <Hidden mdUp implementation="css" key="menuButton">
        <a on="tap:moov_menu.toggle" className={classes.link}>
          <ToolbarButton
            aria-label="Menu"
            color="inherit"
            onClick={this.onMenuButtonClick}
            icon={<MenuIcon open={menu.open} {...menuIconProps} />}
          />
        </a>
      </Hidden>
    )

    if (menuAlign === 'right') {
      items.push(menuButton)
    } else {
      items.unshift(menuButton)
    }

    return (
      <div className={classnames({ [classes.root]: true, [classes.withAmp]: amp })}>
        <div
          className={classnames({
            [classes.wrap]: true,
            [classes.fixed]: fixed,
            [classes.hidden]: this.state.hidden || menu.open,
            [classes.stuck]: (this.state.hidden && this.state.stuck) || menu.open,
            [classes.unstuck]: this.state.hidden && !this.state.stuck,
            [classes.animate]: this.state.animate,
            [classes.menuOpen]: menu.open,
          })}
        >
          <Toolbar disableGutters classes={{ root: classes.toolBar }}>
            {items}
          </Toolbar>
        </div>
      </div>
    )
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll, { passive: true })
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, { passive: true })
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.hidden && this.state.hidden) {
      setTimeout(() => this.setState({ animate: true }), 100)
    }
  }

  onMenuButtonClick = () => {
    this.props.menu.toggle()
  }

  onScroll = () => {
    const height = 64,
      { scrollY } = window,
      { lastScrollY } = this
    const { menu } = this.props

    if (this.state.hidden) {
      if (scrollY <= 0) {
        this.setState({ hidden: false, stuck: false, animate: false })
      }
    } else {
      if (scrollY > height && !menu.open) {
        this.setState({ hidden: true })
      }
    }

    const unstickBufferZone = 15

    if (this.throttledScrollY > scrollY + unstickBufferZone && !this.state.stuck) {
      this.unstickAt = scrollY + unstickBufferZone
      this.setState({ stuck: true })
    } else if (scrollY > this.unstickAt && this.state.stuck && !menu.open) {
      this.setState({ stuck: false })
      delete this.unstickAt
    }

    if (this.lastScrollY > scrollY && this.state.stuck) {
      this.unstickAt = scrollY + unstickBufferZone
    }

    this.lastScrollY = scrollY
    this.sampleScrollSpeed()
  }

  sampleScrollSpeed = throttle(() => (this.throttledScrollY = window.scrollY), 100)
}
