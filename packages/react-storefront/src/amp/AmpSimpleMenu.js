/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component, Fragment } from 'react'
import { inject } from 'mobx-react'
import withStyles from '@material-ui/core/styles/withStyles'
import withTheme from '@material-ui/core/styles/withTheme'
import { Helmet } from 'react-helmet'
import Link from '../Link'
import Typography from '@material-ui/core/Typography'
import classnames from 'classnames'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ListItemText from '@material-ui/core/ListItemText'

export const styles = theme => ({
  root: {
    position: 'relative',
    marginTop: theme.headerHeight,
    height: `calc(100vh - ${theme.headerHeight}px)`,
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '10px 2px 10px -5px rgba(0, 0, 0, 0.2)',
    paddingBottom: '64px',
    '& h3': {
      backgroundColor: theme.palette.background.paper
    },
    '& section[expanded] > h3': {
      color: theme.palette.secondary.contrastText,
      backgroundColor: theme.palette.secondary.main,
      borderColor: theme.palette.secondary.main
    },
    '& a': {
      color: theme.typography.body1.color
    },
    '& ~ div[class*="amphtml-sidebar-mask"]': {
      background: 'rgba(0, 0, 0, 0.5)',
      opacity: 1
    }
  },
  item: {
    padding: '12px 16px',
    borderColor: theme.palette.divider,
    borderWidth: '0 0 1px 0',
    borderStyle: 'solid',
    display: 'block',
    textDecoration: 'none'
  },
  group: {
    textTransform: 'uppercase'
  },
  toggle: {
    position: 'absolute',
    right: '18px',
    top: '12px'
  },
  expand: {
    display: 'block',
    'section[expanded] > h3 > &': {
      display: 'none'
    }
  },
  collapse: {
    display: 'none',
    'section[expanded] > h3 > &': {
      display: 'block'
    }
  }
})

/**
 * An AMP-compatible menu based on amp-sidebar.
 *
 * In addition to the CSS classes that can be overridden of menu subcomponents, you can also
 * assign specific classes to individual menu items by specifying a value for the `className`
 * field on any instance of `MenuItemModel`.
 */
@withTheme()
@withStyles(styles, { name: 'RSFAmpSimpleMenu' })
@inject(({ app }) => ({ menu: app.menu }))
export default class AmpSimpleMenu extends Component {
  static defaultProps = {
    id: 'moov_menu'
  }

  render() {
    const { id, menu, classes, className, drawerWidth, rootHeader, rootFooter, align } = this.props
    const root = menu.levels.length ? menu.levels[0] : null

    return (
      <Fragment>
        <Helmet key="helmet">
          <script
            async
            custom-element="amp-sidebar"
            src="https://cdn.ampproject.org/v0/amp-sidebar-0.1.js"
          />
          <script
            async
            custom-element="amp-accordion"
            src="https://cdn.ampproject.org/v0/amp-accordion-0.1.js"
          />
          <script
            async
            custom-element="amp-bind"
            src="https://cdn.ampproject.org/v0/amp-bind-0.1.js"
          />
          <style amp-custom>{`
            #${id} {
              width: ${drawerWidth}px;
            }
          `}</style>
        </Helmet>
        <amp-sidebar
          key="sidebar"
          id={id}
          class={classnames(className, classes.root)}
          layout="nodisplay"
          side={align}
          on="sidebarClose:AMP.setState({ menuOpen: false })"
        >
          {rootHeader}
          {this.renderItem(root)}
          {rootFooter}
        </amp-sidebar>
      </Fragment>
    )
  }

  renderItem(item, key) {
    if (item == null) {
      return null
    } else if (item.items) {
      return this.renderGroup(item, key)
    } else {
      return this.renderLeaf(item, key)
    }
  }

  renderGroup(item, key) {
    let { classes, ExpandIcon, CollapseIcon, theme } = this.props

    ExpandIcon = ExpandIcon || theme.ExpandIcon || ExpandMoreIcon
    CollapseIcon = CollapseIcon || theme.CollapseIcon || ExpandLessIcon

    const section = (
      <section key={key}>
        {item.text && (
          <Typography
            variant="body1"
            component="h3"
            className={classnames(classes.item, classes.group, item.className)}
          >
            {item.text}
            <CollapseIcon className={classnames(classes.toggle, classes.collapse)} />
            <ExpandIcon className={classnames(classes.toggle, classes.expand)} />
          </Typography>
        )}
        <div>{item.items.map((item, i) => this.renderItem(item, i))}</div>
      </section>
    )

    if (item.root) {
      return section
    } else {
      return (
        <amp-accordion key={key} disable-session-states>
          {section}
        </amp-accordion>
      )
    }
  }

  renderLeaf(item, key) {
    return (
      <Link key={key} className={classnames(this.props.classes.item, item.className)} to={item.url}>
        <ListItemText>{item.text}</ListItemText>
      </Link>
    )
  }
}
