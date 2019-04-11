/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component, Fragment } from 'react'
import { Helmet } from 'react-helmet'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export const styles = theme => ({
  accordion: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  title: {
    backgroundColor: 'transparent',
    padding: '12px 15px',
    borderStyle: 'none',
    outlineWidth: 0,
  },
  section: {},
  toggle: {
    position: 'absolute',
    right: '18px',
    top: '13px',
  },
  expand: {
    display: 'block',
    'section[expanded] &': {
      display: 'none',
    },
  },
  collapse: {
    display: 'none',
    'section[expanded] &': {
      display: 'block',
    },
  },
  body: {
    backgroundColor: 'transparent',
    padding: `0 ${theme.margins.container}px`,
  },
})

/**
 * An AMP-compatible expandable section based on amp-accordion.
 */
@withStyles(styles, { name: 'RSFAmpExpandableSection' })
export default class AmpExpandableSection extends Component {
  static propTypes = {
    /**
     * The title for the header of the expandable section
     */
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

    /**
     * Set to true to expand the panel
     */
    expanded: PropTypes.bool,

    /**
     * The icon to use for collapsed groups
     */
    ExpandIcon: PropTypes.func,

    /**
     * The icon to use for expanded groups
     */
    CollapseIcon: PropTypes.func,
  }

  static defaultProps = {
    expanded: false,
    ExpandIcon: ExpandMore,
    CollapseIcon: ExpandLess,
  }

  render() {
    let { classes, expanded, children = [], title, ExpandIcon, CollapseIcon } = this.props

    if (ExpandIcon === ExpandMore) {
      CollapseIcon = ExpandLess
    }

    const sectionAttributes = {}

    if (expanded) sectionAttributes.expanded = ''

    return (
      <Fragment>
        <Helmet>
          <script
            async
            custom-element="amp-accordion"
            src="https://cdn.ampproject.org/v0/amp-accordion-0.1.js"
          />
        </Helmet>
        <amp-accordion disable-session-states class={classes.accordion}>
          <section className={classes.section} {...sectionAttributes}>
            <Typography variant="subtitle1" component="h3" className={classes.title}>
              {title}
              <ExpandIcon className={classnames(classes.toggle, classes.expand)} />
              <CollapseIcon className={classnames(classes.toggle, classes.collapse)} />
            </Typography>
            <div className={classes.body}>{children}</div>
          </section>
        </amp-accordion>
      </Fragment>
    )
  }
}
