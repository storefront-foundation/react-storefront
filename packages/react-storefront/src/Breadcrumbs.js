/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import ArrowRight from '@material-ui/icons/KeyboardArrowRight'
import Link from './Link'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import { inject, observer } from 'mobx-react'
import Track from './Track'
import Container from './Container'
import PropTypes from 'prop-types'

export const styles = theme => ({
  breadcrumbs: {
    margin: '0',
    backgroundColor: '#F4F2F1',
    padding: '12px 0',

    '& a': {
      color: theme.palette.text.primary,
      textDecoration: 'none',
    },
  },

  separator: {
    height: '12px',
    position: 'relative',
    top: '3px',
    width: '16px',
  },

  current: {
    fontWeight: 'bold',
    color: theme.palette.text.primary,
  },
})

/**
 * Renders a list of breadcrumbs from AppModelBase.breadcrumbs.  When a breadcrumb is clicked, the breadcrumb_clicked
 * analytics event is automatically fired.
 */
@withStyles(styles, { name: 'RSFBreadcrumbs' })
@inject('app')
@observer
export default class Breadcrumbs extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.objectOf),
  }

  render() {
    let {
      app: { breadcrumbs },
      items,
      classes,
    } = this.props

    breadcrumbs = items || breadcrumbs

    return (
      <Typography className={classes.breadcrumbs} variant="caption">
        <Container>
          {breadcrumbs && breadcrumbs.map(this.renderBreadcrumb)}
          <span>&nbsp;</span>
        </Container>
      </Typography>
    )
  }

  renderBreadcrumb = (item, i) => {
    const { classes } = this.props

    if (item.url) {
      return (
        <span key={i}>
          <Track event="breadcrumbClicked" breadcrumb={item}>
            <Link to={item.url} state={item.state}>
              {item.text}
            </Link>
          </Track>
          <ArrowRight className={classes.separator} />
        </span>
      )
    } else {
      return (
        <span key={i} className={classes.current}>
          {item.text}
        </span>
      )
    }
  }
}
