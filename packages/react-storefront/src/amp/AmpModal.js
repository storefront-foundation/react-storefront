/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component, Fragment } from 'react'
import { Helmet } from 'react-helmet'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'

export const styles = theme => ({
  root: {
    zIndex: theme.zIndex.amp.modal + 2, // zIndex of AppBar's withAmp + 1
    backgroundColor: 'rgba(255, 255, 255, .8)',
  },
})

/**
 * An AMP-compatible modal based on `<amp-lightbox>`
 *
 * All props not specifically documented here are spread to the `<amp-lightbox>` element.
 * More info about amp-lightbox on AMP docs: https://www.ampproject.org/docs/reference/components/amp-lightbox
 *
 * Usage example:
 *
 *  <button on="tap:modal">Open Modal</button>
 *
 *  <AmpModal id="modal">
 *    <button on="tap:modal.close">Close Modal</button>
 *    <div>Modal content ...</div>
 *  </AmpModal>
 */
@withStyles(styles, { name: 'RSFAmpModal' })
export default class AmpModal extends Component {
  static propTypes = {
    /**
     * The id for the amp-lightbox element.
     * This is REQUIRED attribute.
     */
    id: PropTypes.string,

    /**
     * Defines the style of animation for opening the lightbox.
     * By default, this will be set to `fade-in`.
     * Valid values are `fade-in`, `fly-in-bottom` and `fly-in-top`.
     *
     * Note: The `fly-in-*` animation presets modify the transform property of the amp-lightbox element.
     * Do not rely on transforming the amp-lightbox element directly.
     * If you need to apply a transform, set it on a nested element instead.
     */
    animateIn: PropTypes.string,
  }

  static defaultProps = {
    animateIn: 'fade-in',
  }

  render() {
    let { id, animateIn, classes, children, ...others } = this.props

    if (!id) {
      return new Error('Prop `id` is required for `AmpModal` component')
    }

    return (
      <Fragment>
        <Helmet key="helmet">
          <script
            async
            custom-element="amp-lightbox"
            src="https://cdn.ampproject.org/v0/amp-lightbox-0.1.js"
          />
        </Helmet>
        <amp-lightbox
          key="lightbox"
          layout="nodisplay"
          id={id}
          animate-in={animateIn}
          class={classes.root}
          {...others}
        >
          {children}
        </amp-lightbox>
      </Fragment>
    )
  }
}
