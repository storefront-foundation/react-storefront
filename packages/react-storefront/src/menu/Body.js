/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React, { Component, Fragment } from 'react'
import { observer, inject } from 'mobx-react'
import List from '@material-ui/core/List'
import Item from './Item'
import MenuContext from './MenuContext'
import LeafHeader from './LeafHeader'
import LeafFooter from './LeafFooter'

@inject('app')
@observer
export default class Body extends Component {
  static contextType = MenuContext

  render() {
    const {
      rootHeader,
      rootFooter,
      renderLeafHeader,
      renderLeafFooter,
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
                {list.root ? (
                  rootHeader
                ) : (
                  <LeafHeader
                    classes={classes}
                    goBack={this.goBack}
                    list={list}
                    render={renderLeafHeader}
                  />
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

                {list.root ? rootFooter : <LeafFooter list={list} render={renderLeafFooter} />}
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
