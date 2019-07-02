/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React, { Component, Fragment } from 'react'
import { observer, inject } from 'mobx-react'
import Branch from './Branch'
import Leaf from './Leaf'

@inject('app')
@observer
export default class Item extends Component {
  render() {
    let NodeType = Leaf,
      result = null

    const { item, itemRenderer } = this.props

    if (item.hasChildren()) {
      NodeType = Branch
    }

    if (itemRenderer) {
      result = itemRenderer(item, item.leaf)
    }

    if (result == null) {
      result = (
        <NodeType
          expandFirstItem={this.props.expandFirstItem}
          itemContentRenderer={this.props.itemContentRenderer}
          itemRenderer={itemRenderer}
          trackSelected={this.props.trackSelected}
          ExpandIcon={this.props.ExpandIcon}
          CollapseIcon={this.props.CollapseIcon}
          theme={this.props.theme}
          item={item}
          index={this.props.index}
          depth={this.props.depth}
          useExpanders={this.props.useExpanders}
          simple={this.props.simple}
          depth={this.props.depth}
        />
      )
    }

    return result
  }
}
