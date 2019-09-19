/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import withStyles from '@material-ui/core/styles/withStyles'
import { inject } from 'mobx-react'

/**
 * AMP ready video component
 *
 * Usage:
 *
 * <Video
 *  src="https://amp.dev/static/inline-examples/videos/kitten-playing.webm"
 *  controls
 * />
 *
 */
export const styles = theme => ({
  root: {
    height: '100%',
    width: '100%',
    overflow: 'hidden'
  }
})

@withStyles(styles, { name: 'RSFVideo' })
@inject(({ app }) => ({ amp: app.amp }))
export default class Video extends Component {
  static defaultProps = {
    controls: true
  }
  render() {
    const { children, classes, amp, ...props } = this.props
    const Tag = amp ? 'amp-video' : 'video'
    const tagProps = {
      [amp ? 'class' : 'className']: classes.root,
      ...props
    }
    // Layout must be declared in AMP, so we use "fill" by default if not defined
    if (amp && !props.height && !props.width && !props.layout) {
      tagProps.layout = 'fill'
    }
    return (
      <React.Fragment>
        {amp && (
          <Helmet>
            <script
              async
              custom-element="amp-video"
              src="https://cdn.ampproject.org/v0/amp-video-0.1.js"
            />
          </Helmet>
        )}
        <Tag {...tagProps}>{children}</Tag>
      </React.Fragment>
    )
  }
}
