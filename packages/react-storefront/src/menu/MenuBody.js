/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React, { Component, Fragment } from 'react'
import ListItemText from '@material-ui/core/ListItemText'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import classnames from 'classnames'
import Item from './Item'
import MenuContext from './MenuContext'

export default class MenuBody extends Component {
  static contextType = MenuContext

  render() {
    const { classes, rootHeader, rootFooter, root, path, depth } = this.props

    const parentPath = path.length ? '@' + path.slice(0, path.length - 1).join(',') : null

    const id = '@' + path.join(',')

    const isRoot = id === '@'

    const header = !isRoot && (
      <ListItem divider button on={`tap:AMP.setState({ rsfMenu: { list: '${parentPath}' } })`}>
        <ListItemIcon classes={{ root: classes.header }}>
          <ChevronLeft className={classes.icon} />
        </ListItemIcon>
        <ListItemText
          classes={{ root: classes.headerText }}
          primary={<div className={classes.headerText}>{root.text} </div>}
        />
      </ListItem>
    )

    return (
      <div
        className={classnames(classes.ampBody, {
          [classes.inFocus]: isRoot,
          [classes.hiddenRight]: !isRoot
        })}
        amp-bind={`class=>rsfMenu.list == '${id}'  ? '${classnames(
          classes.ampBody,
          classes.inFocus
        )}' : '${classnames(classes.ampBody, {
          [classes.hiddenLeft]: isRoot,
          [classes.hiddenRight]: !isRoot
        })}'`}
      >
        <List classes={{ padding: classes.ampList }}>
          {rootHeader}
          {header}
          {root.items.map((item, i) => (
            <Item {...this.props} depth={depth} item={item} key={i} index={i} />
          ))}
          {rootFooter}
        </List>
      </div>
    )
  }
}
