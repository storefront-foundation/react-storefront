/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import withStyles from '@material-ui/core/styles/withStyles'

export const styles = () => ({
  accordion: {}
})

@withStyles(styles, { name: 'RSFAmpAccordion' })
export default class AmpAccordion extends Component {
  render() {
    const { classes, children, ...otherProps } = this.props
    return (
      <>
        <Helmet>
          <script
            async
            custom-element="amp-accordion"
            src="https://cdn.ampproject.org/v0/amp-accordion-0.1.js"
          />
        </Helmet>
        <amp-accordion
          expand-single-section
          disable-session-states
          class={classes.accordion}
          {...otherProps}
        >
          {children}
        </amp-accordion>
      </>
    )
  }
}
