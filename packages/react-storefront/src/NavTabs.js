/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { types, getParent } from 'mobx-state-tree'
import { MenuItemModel } from './Menu'
import TabsRow from './TabsRow'
import withStyles from '@material-ui/core/styles/withStyles'
import NavTab from './NavTab'
import { relativeURL } from './utils/url'
import { Fade, Paper, Popper, Hidden } from '@material-ui/core'
import { parseState } from './utils/state'

/**
 * Scrollable navigation tabs for the top of the app. All extra props are spread to the
 * underlying Material UI Tabs element.  When a tab is clicked, the "top_nav_clicked" analytics
 * event is fired.
 */
export const styles = theme => ({
  tabs: {
    maxWidth: theme.maxWidth,
    flex: 1
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
      background:
        'linear-gradient(to right, rgba(255, 255, 255, 1.0) 0%, rgba(255, 255, 255, 0.0) 100%)',
      zIndex: 1
    },
    '&::after': {
      content: "''",
      top: 0,
      right: 0,
      width: '15px',
      height: 'calc(100% - 3px)',
      position: 'absolute',
      background:
        'linear-gradient(to left, rgba(255, 255, 255, 1.0) 0%, rgba(255, 255, 255, 0.0) 100%)',
      zIndex: 1
    }
  },
  menu: {
    zIndex: theme.zIndex.appBar
  },
  menuPaper: {
    borderRadius: '0',
    position: 'relative',
    top: '1px'
  },
  tab: {} // prevents MUI warning about overriding classes.tab prop
})

@withStyles(styles, { name: 'RSFNavTabs' })
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

  state = {
    open: false,
    menu: null,
    anchorEl: null,
    overTab: false,
    overMenu: false
  }

  render() {
    const { tabs, classes, staticContext, history, elevation, ...tabsProps } = this.props
    const { menu, overTab, overMenu, anchorEl } = this.state
    const open = overTab || overMenu

    if (!tabs) return null

    const { selected } = tabs

    return (
      <Fragment>
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
        {!menu ? null : (
          <Hidden xsDown>
            <Popper className={classes.menu} open={open} anchorEl={anchorEl} transition>
              {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                  <Paper
                    onMouseEnter={this.onMenuEnter}
                    onMouseLeave={this.onMenuLeave}
                    className={classes.menuPaper}
                  >
                    {menu}
                  </Paper>
                </Fade>
              )}
            </Popper>
          </Hidden>
        )}
      </Fragment>
    )
  }

  renderTab = (item, i) => {
    return (
      <NavTab
        {...item}
        key={i}
        item={item}
        onMouseEnter={this.showMenu}
        onMouseLeave={this.onTabLeave}
        onItemClick={this.onItemClick}
        onClick={this.onItemClick}
      />
    )
  }

  showMenu = ({ menu, target }) => {
    this.setState({
      overTab: true,
      anchorEl: target,
      menu
    })
  }

  onMenuEnter = () => {
    this.setState({ overMenu: true })
  }

  onMenuLeave = () => {
    this.setState({ overMenu: false })
  }

  onTabLeave = () => {
    this.setState({ overTab: false })
  }

  onItemClick = () => {
    this.setState({ overTab: false, overMenu: false })
  }

  handleChange = (_event, newValue) => {
    const { tabs, history } = this.props
    const item = tabs.items[newValue]
    const url = relativeURL(item.url)

    if (history) {
      history.push(url, parseState(item.state))
    } else {
      window.location.href = url
    }
  }
}

export const TabsModel = types
  .model('TabsModel', {
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
