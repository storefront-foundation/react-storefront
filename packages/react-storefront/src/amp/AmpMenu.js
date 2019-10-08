/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component, Fragment } from 'react'
import { inject } from 'mobx-react'
import withStyles from '@material-ui/core/styles/withStyles'
import withTheme from '@material-ui/core/styles/withTheme'
import { Helmet } from 'react-helmet'
import AmpMenuBody from '../amp/AmpMenuBody'
import classnames from 'classnames'
import AmpState from './AmpState'

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
    '& .expanded > .menu-item': {
      color: theme.palette.secondary.contrastText,
      backgroundColor: theme.palette.secondary.main,
      borderColor: theme.palette.secondary.main,
      '& svg': {
        fill: theme.palette.secondary.contrastText
      }
    },
    '& a': {
      color: theme.typography.body1.color
    },
    '& ~ div[class*="amphtml-sidebar-mask"]': {
      background: 'rgba(0, 0, 0, 0.5)',
      opacity: 1
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
@withStyles(styles, { name: 'RSFAmpMenu' })
@inject(({ app }) => ({ menu: app.menu }))
export default class AmpMenu extends Component {
  static defaultProps = {
    id: 'moov_menu'
  }

  render() {
    const { id, menu, classes, theme, className, align, drawerWidth, ...others } = this.props
    const root = menu.levels[0]

    if (!root) return null

    const bodies = [
      <AmpMenuBody
        {...others}
        key={0}
        drawerWidth={drawerWidth}
        root={root}
        depth={0}
        path={[]}
        classes={classes}
        theme={theme}
        // Force expanders in AMP
        useExpanders
      />
    ]

    // Build first level menu screens
    root.items.forEach((node, index) => {
      if (node.items) {
        bodies.push(
          <AmpMenuBody
            {...others}
            key={index + 1}
            drawerWidth={drawerWidth}
            root={node}
            depth={1}
            path={[index]}
            classes={classes}
            theme={theme}
            // Force expanders in AMP
            useExpanders
          />
        )
      }
    })

    return (
      <Fragment>
        <AmpState id="rsfMenu" initialState={{ open: false }} />
        <Helmet key="helmet">
          <script
            async
            custom-element="amp-sidebar"
            src="https://cdn.ampproject.org/v0/amp-sidebar-0.1.js"
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
          on="sidebarClose:AMP.setState({ rsfMenu: { open: false } })"
        >
          {bodies}
        </amp-sidebar>
      </Fragment>
    )
  }
}
