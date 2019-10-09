/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import List from '@material-ui/core/List'
import classnames from 'classnames'
import Item from '../menu/Item'
import MenuContext from '../menu/MenuContext'
import LeafHeader from '../menu/LeafHeader'
import LeafFooter from '../menu/LeafFooter'

export default class AmpMenuBody extends Component {
  static contextType = MenuContext

  render() {
    const {
      classes,
      rootHeader,
      rootFooter,
      renderLeafHeader,
      renderLeafFooter,
      root,
      path,
      depth
    } = this.props

    const parentPath = path.length ? '@' + path.slice(0, path.length - 1).join(',') : null
    const id = '@' + path.join(',')
    const isRoot = id === '@'

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
          {isRoot ? (
            rootHeader
          ) : (
            <LeafHeader
              parentPath={parentPath}
              classes={classes}
              list={root}
              render={renderLeafHeader}
            />
          )}
          {root.items.map((item, i) => (
            <Item {...this.props} depth={depth} item={item} key={i} index={i} />
          ))}
          {isRoot ? (
            rootFooter
          ) : (
            <LeafFooter
              parentPath={parentPath}
              classes={classes}
              list={root}
              render={renderLeafFooter}
            />
          )}
        </List>
      </div>
    )
  }
}
