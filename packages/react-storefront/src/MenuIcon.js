import React, { PureComponent } from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'
import Open from './assets/menu.svg'
import Close from '@material-ui/icons/Close'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { withStyles } from '@material-ui/core'
import PropTypes from 'prop-types'

export const styles = theme => ({
  root: {
    position: 'relative',
    height: '24px',
    width: '24px',
    boxSizing: 'border-box',

    '& .rsf-menu-icon-enter': {
      opacity: 0.01,
      transform: 'scale(0) rotate(45deg)'
    },

    '& .rsf-menu-icon-enter.rsf-menu-icon-enter-active': {
      opacity: 1,
      transform: 'scale(1) rotate(0deg)',
      transition: 'all 250ms ease-out'
    },

    '& .rsf-menu-icon-exit': {
      opacity: 1,
      transform: 'scale(1) rotate(0deg)'
    },

    '& .rsf-menu-icon-exit.rsf-menu-icon-exit-active': {
      opacity: 0.01,
      transform: 'scale(0) rotate(45deg)',
      transition: 'all 250ms ease-in'
    }
  },

  icon: {
    color: theme.palette.action.active,
    position: 'absolute',
    top: 0,
    left: 0
  }
})

/**
 * A menu icon that animates transitions between open and closed states.
 */
@withStyles(styles, { name: 'RSFMenuIcon' })
export default class MenuIcon extends PureComponent {

  static propTypes = {
    /**
     * Set to true when the menu is open, otherwise false
     */
    open: PropTypes.bool,

    /**
     * The icon to display when the menu is closed
     */
    OpenIcon: PropTypes.oneOfType([ PropTypes.string, PropTypes.func ]),

    /**
     * The icon to display when the menu is open
     */
    CloseIcon: PropTypes.oneOfType([ PropTypes.string, PropTypes.func ])
  }

  static defaultProps = {
    open: false,
    OpenIcon: Open,
    CloseIcon: Close
  }

  cssProps = { classNames: 'rsf-menu-icon', timeout: 300 }

  render() {
    const { open, classes, OpenIcon, CloseIcon } = this.props

    return (
      <div className={classes.root}>
        <TransitionGroup>
          {!open ? (
            <CSSTransition {...this.cssProps} key="open">
              <SvgIcon className={classes.icon}>
                <OpenIcon />
              </SvgIcon>
            </CSSTransition>
          ) : (
            <CSSTransition {...this.cssProps} key="close">
              <SvgIcon className={classes.icon}>
                <CloseIcon />
              </SvgIcon>
            </CSSTransition>
          )}
        </TransitionGroup>
      </div>
    )
  }

}