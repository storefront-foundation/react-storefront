/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import { inject } from 'mobx-react'
import PropTypes from 'prop-types'
import { relativeURL, absoluteURL, canUseClientSideNavigation } from './utils/url'
import { prefetchJsonFor } from './router/serviceWorker'
import VisibilitySensor from 'react-visibility-sensor'
import withStyles from '@material-ui/core/styles/withStyles'
import classnames from 'classnames'
import dataProps from './utils/dataProps'

export const styles = {
  root: {},
};

@withStyles(styles, { name: 'RSFLink' })
@inject(({ history, router, app }) => ({ history, router, location: app.location }))
export default class Link extends Component {

  prefetched = false

  static propTypes = {
    /**
     * The path to navigate to when the link is clicked
     */
    to: PropTypes.string,

    /**
     * Data to assign to the history state
     */
    state: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

    /**
     * Set to true to force server side navigation.  Defaults to false
     */
    server: PropTypes.bool,

    /**
     * Set to "visible" to prefetch linked page data when the link is scrolled into view.  
     * Set to "always" to prefetch even when the link is hidden.
     */
    prefetch: PropTypes.oneOf(['always', 'visible']),

    /**
     * Set this prop to prefetch a URL other than the one specified in the to prop
     */
    prefetchURL: PropTypes.string,

    /**
     * A function to call when the link is clicked.
     */
    onClick: PropTypes.func
  }

  constructor() {
    super()
    this.el = React.createRef()
  }

  componentDidMount() {
    if (this.props.prefetch === 'always') {
      this.prefetch()
    }
  }

  componentDidUpdate() {
    if (this.prefetched !== this.urlToPrefetch()) {
      // reset prefetched state if the prefetch url changes
      this.prefetched = null
    }
  }

  prefetch() {
    const url = this.urlToPrefetch()

    if (this.prefetched !== url) {
      prefetchJsonFor(url)
      this.prefetched = url
    }
  }

  urlToPrefetch() {
    return this.props.prefetchURL || this.props.to
  }

  render() {
    const { className, style, children, prefetch, to, location, ...others } = this.props

    const props = {
      ...dataProps(others),
      'data-moov-link': 'on',
      className: classnames(this.props.classes.root, className),
      ref: this.el,
      style,
      onClick: this.onClick,
      href: absoluteURL(to, location) // we always render absolute URLs for SEO purposes
    }

    if (prefetch) {
      props['data-moov-rel'] = 'prefetch';
    }

    const link = <a {...props}>{children}</a>

    if (prefetch === 'visible') {
      return (
        <VisibilitySensor onChange={this.onVisibleChange} partialVisibility>
          {link}
        </VisibilitySensor>
      )
    } else {
      return link
    }
  }

  onVisibleChange = (visible) => {
    if (visible) {
      const el = this.el.current

      // Will get here if the link is on a hidden page
      // for some reason the visibility sensor fires for all links on a page right after 
      // that page has been hidden.  We check el.offsetParent to make sure the link is truly visible
      // see https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom for more info on this method
      if (el.offsetParent != null) {
        this.prefetch()
      }
    }
  }

  onClick = e => {
    let { server, onClick, to, state } = this.props
    
    if (onClick) {
      onClick(e)
    }

    if (typeof state === 'function') {
      state = state()
    }

    const url = relativeURL(to)

    if (!e.isDefaultPrevented() && !server && canUseClientSideNavigation(url)) {
      e.preventDefault()

      if (this.props.history) {
        this.props.history.push(url, state && state.toJSON ? state.toJSON() : state)
      } else {
        // Fallback to redirect
        window.location.href = url
      }
    }
  }

}
