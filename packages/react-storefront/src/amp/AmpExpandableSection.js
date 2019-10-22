/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import AmpAccordion from './AmpAccordion'

export const styles = theme => ({
  section: {
    boxShadow: 'none',
    borderBottom: `1px solid ${theme.palette.divider}`,
    background: 'transparent'
  },
  title: {
    backgroundColor: 'transparent',
    padding: '12px 15px',
    borderStyle: 'none',
    outlineWidth: 0
  },
  toggle: {
    position: 'absolute',
    right: '18px',
    top: '13px'
  },
  expand: {
    display: 'block',
    'section[expanded] &': {
      display: 'none'
    }
  },
  collapse: {
    display: 'none',
    'section[expanded] &': {
      display: 'block'
    }
  },
  body: {
    backgroundColor: 'transparent',
    padding: `0 ${theme.margins.container}px`
  }
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

    /**
     * Expanded section ID used by accordion
     */
    expandedSectionId: PropTypes.string
  }

  static defaultProps = {
    expanded: false,
    ExpandIcon: ExpandMore,
    CollapseIcon: ExpandLess
  }

  render() {
    let {
      classes,
      expanded,
      children = [],
      title,
      ExpandIcon,
      CollapseIcon,
      expandedSectionId
    } = this.props

    if (ExpandIcon === ExpandMore) {
      CollapseIcon = ExpandLess
    }

    const sectionAttributes = {}

    if (expanded) sectionAttributes.expanded = ''

    const section = (
      <section className={classes.section} {...sectionAttributes}>
        <Typography variant="subtitle1" component="h3" className={classes.title}>
          {title}
          <ExpandIcon className={classnames(classes.toggle, classes.expand)} />
          <CollapseIcon className={classnames(classes.toggle, classes.collapse)} />
        </Typography>
        <div className={classes.body}>{children}</div>
      </section>
    )

    if (expandedSectionId !== undefined) {
      return section
    }

    return <AmpAccordion>{section}</AmpAccordion>
  }
}
