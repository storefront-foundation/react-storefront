/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import throttle from 'lodash/throttle'
import ArrowUpward from '@material-ui/icons/ArrowUpward'
import Fab from '@material-ui/core/Fab'
import Fade from '@material-ui/core/Fade'
import { withStyles } from '@material-ui/core/styles'

const styles = () => ({
  root: {
    zIndex: 1,
    position: 'fixed',
    bottom: 24,
    right: 16
  },
  fab: {
    background: 'rgba(0,0,0,.85)',
    '&:hover': {
      background: 'rgb(0,0,0)'
    }
  },
  icon: {
    color: 'white'
  }
})

/**
 * Customizable component which scrolls to top of the page
 */
@withStyles(styles, { name: 'RSFBackToTop' })
export default class BackToTop extends Component {
  static propTypes = {
    /**
     * The icon to use within Fab component
     */
    Icon: PropTypes.func,
    /**
     * value which controls where along the Y position the BackToTop component is shown
     */
    showUnderY: PropTypes.number,
    /**
     * When the scroll position is less than this value, the page will smoothly scroll back up. If
     * the scroll position is more than this value, the page will immediately scroll back up.
     */
    instantBehaviorUnderY: PropTypes.number,
    /**
     * Fade in/out animation time of icon
     */
    fadeTime: PropTypes.number,
    /**
     * Controls size of component. Values allowed are [small, medium, large]
     */
    size: PropTypes.string
  }

  static defaultProps = {
    showUnderY: 250,
    instantBehaviorUnderY: 3000,
    fadeTime: 320,
    size: 'medium'
  }

  state = {
    visible: false
  }

  constructor(props) {
    super(props)
    this.el = createRef()
  }

  componentDidMount() {
    this.onScroll()
    window.addEventListener('scroll', this.onScroll, { passive: true })
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  }

  get scrollY() {
    return window.scrollY || window.pageYOffset
  }

  onScroll = throttle(() => {
    this.setState({
      visible:
        this.scrollY > this.props.showUnderY &&
        this.el.current.parentElement &&
        this.el.current.parentElement.offsetParent != null
    })
  }, 200)

  scrollToTop = () => {
    const behavior = this.scrollY > this.props.instantBehaviorUnderY ? 'auto' : 'smooth'
    window.scrollTo({ top: 0, left: 0, behavior })
  }

  render() {
    const { classes, fadeTime, size } = this.props
    const { visible } = this.state
    const Icon = this.props.Icon || ArrowUpward

    return (
      <div className={classes.root} ref={this.el}>
        <Fade in={visible} timeout={fadeTime}>
          <Fab className={classes.fab} size={size} onClick={this.scrollToTop}>
            <Icon className={classes.icon} />
          </Fab>
        </Fade>
      </div>
    )
  }
}
