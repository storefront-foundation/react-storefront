/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React, { Component, Fragment } from 'react'
import { observer, inject } from 'mobx-react'
import ListItemText from '@material-ui/core/ListItemText'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Item from './Item'
import MenuContext from './MenuContext'

@inject('app')
@observer
export default class Body extends Component {
  static contextType = MenuContext

  render() {
    const {
      rootHeader,
      rootFooter,
      simple,
      drawerWidth,
      children,
      app: { menu }
    } = this.props

    const { levels, level } = menu
    const position = -drawerWidth * level
    const { classes } = this.context

    return (
      <Fragment>
        {children}
        {simple ? (
          this.renderSimple()
        ) : (
          <div
            className={classes.bodyWrap}
            style={{ transform: `translateX(${position}px)`, flex: 1 }}
          >
            {levels.map((list, depth) => (
              <List
                style={{ width: `${drawerWidth}px` }}
                classes={{ root: classes.list, padding: classes.padding }}
                key={depth}
              >
                {list.root && rootHeader}
                {!list.root && (
                  <ListItem divider button onClick={this.goBack}>
                    <ListItemIcon classes={{ root: classes.header }}>
                      <ChevronLeft className={classes.icon} />
                    </ListItemIcon>
                    <ListItemText
                      classes={{ root: classes.headerText }}
                      primary={<div className={classes.headerText}>{list.text} </div>}
                    />
                  </ListItem>
                )}
                {list.items &&
                  list.items.map((item, key) => (
                    <Item
                      {...this.props}
                      item={item}
                      key={key}
                      depth={depth}
                      classes={{ list: classes.list, listItem: classes.listItem }}
                    />
                  ))}
                {list.root && rootFooter}
              </List>
            ))}
          </div>
        )}
      </Fragment>
    )
  }

  /**
   * Renders the menu as a simple list of expandable sections
   * @return {List}
   */
  renderSimple() {
    const {
      rootHeader,
      rootFooter,
      app: { menu }
    } = this.props

    const { classes } = this.context
    const root = menu && menu.levels && menu.levels[0]

    if (!root) return null

    return (
      <List classes={{ padding: classes.list }}>
        {rootHeader}
        {root.items.map((item, i) => (
          <Item {...this.props} depth={1} item={item} key={i} />
        ))}
        {rootFooter}
      </List>
    )
  }

  goBack = () => {
    this.props.app.menu.goBack()
  }
}
