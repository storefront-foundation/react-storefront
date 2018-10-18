/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import { types, getParent } from "mobx-state-tree"
import { MenuItemModel } from './Menu'
import TabsRow from './TabsRow'
import withStyles from '@material-ui/core/styles/withStyles'
import Track from './Track'
import Link from './Link'
import { relativeURL } from './utils/url'

/**
 * Scrollable navigation tabs for the top of the app. All extra props are spread to the 
 * underlying Material UI Tabs element.  When a tab is clicked, the "top_nav_clicked" analytics
 * event is fired.
 */
export const styles = theme => ({
  tab: {
    height: '56px',
  },
  tabs: {
    maxWidth: theme.maxWidth,
    flex: 1,
  },
  link: {
    display: 'block',
    height: '100%',
    fontSize: theme.typography.body1.fontSize
  },
  clickEl: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1
  },
  root: {
    zIndex: theme.zIndex.appBar - 1,
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 0,
    '&::before': {
      content: "''",
      top: 0,
      left: 0,
      width: '15px',
      height: 'calc(100% - 3px)',
      position: 'absolute',
      background: 'linear-gradient(to right, rgba(255, 255, 255, 1.0) 0%, rgba(255, 255, 255, 0.0) 100%)',
      zIndex: 1,
    },
    '&::after': {
      content: "''",
      top: 0,
      right: 0,
      width: '15px',
      height: 'calc(100% - 3px)',
      position: 'absolute',
      background: 'linear-gradient(to left, rgba(255, 255, 255, 1.0) 0%, rgba(255, 255, 255, 0.0) 100%)',
      zIndex: 1,
    }
  }
});

@withStyles(styles)
@inject(({ app, history }) => ({ tabs: app.tabs, history }))
@observer
export default class NavTabs extends Component {

  static propTypes = {
    classes: PropTypes.objectOf(PropTypes.string),

    /**
     * Controls the amount of drop shadow.
     */
    elevation: PropTypes.number
  }

  static defaultProps = {
    elevation: 2
  }

  render() {
    const { tabs, classes, staticContext, history, elevation, ...tabsProps } = this.props

    if (!tabs) return null

    const { selected } = tabs

    return (
      <Paper className={classes.root} elevation={elevation}>
        <TabsRow
          initialSelectedIdx={selected}
          onTabChange={this.handleChange}
          items={tabs.items}
          tabRenderer={this.renderTab}
          centered
          classes={{
            root: classes.tabs,
            tab: classes.tab
          }}
          {...tabsProps}
        />
      </Paper>
    )
  }

  renderTab = item => {
    const { classes } = this.props

    return (
      <Fragment>
        <Track event="topNavClicked" item={item}>
          <div className={classes.clickEl} data-th="topNavClicked"></div>
        </Track>
        <Link state={item.state} className={classes.link} to={item.url} prefetch={item.prefetch} onClick={this.onLinkClick}>{item.text}</Link>
      </Fragment>
    )
  }

  handleChange = (_event, newValue) => {
    const { tabs, history } = this.props
    const item = tabs.items[newValue]
    const url = relativeURL(item.url)

    if (history) {
      history.push(url, item.state && item.state.toJSON())
    } else {
      window.location.href = url
    }
  }

}

export const TabsModel = types
  .model("TabsModel", {
    items: types.array(MenuItemModel)
  })
  .views(self => ({
    get selected() {
      const { location } = getParent(self)
      const url = location.pathname + location.search
      const index = self.items.findIndex(item => item.url === url)
      return index === -1 ? null : index
    }
  }))
