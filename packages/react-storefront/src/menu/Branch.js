/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React, { Component, Fragment } from 'react'
import { observer, inject } from 'mobx-react'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import Collapse from '@material-ui/core/Collapse'
import classnames from 'classnames'
import ItemContent from './ItemContent'
import Item from './Item'
import MenuContext from './MenuContext'

@inject('app')
@observer
export default class Branch extends Component {
  static contextType = MenuContext

  render() {
    let {
      app: { menu, amp },
      useExpanders,
      simple,
      depth,
      index,
      item,
      ...others
    } = this.props

    const { classes } = this.context
    const showExpander = simple || (depth > 0 && useExpanders)

    const interactionProps = {
      onClick: showExpander
        ? this.toggleItemExpaned.bind(this, item)
        : this.slideToItem.bind(this, item, menu),
      classes: {
        root: classnames(classes.listItem, item.className, {
          [classes.expanded]: item.expanded,
          [classes.expander]: showExpander
        })
      }
    }

    const sublist = `${depth}.${index}`

    const ampProps = {
      on:
        depth === 0
          ? `tap:AMP.setState({ list: '@${index}' })`
          : `tap:AMP.setState({ sublist: sublist == '${sublist}' ? null : '${sublist}' })`,
      depth,
      index
    }

    const elements = [
      <div key="item" amp-bind={`class=>sublist == '${sublist}' ? 'expanded' : ''`}>
        <MenuItem className="menu-item" button divider {...(amp ? ampProps : interactionProps)}>
          <ItemContent
            {...others}
            item={item}
            leaf={false}
            showExpander={showExpander}
            sublist={sublist}
          />
        </MenuItem>
      </div>
    ]

    if (showExpander) {
      const props = amp
        ? {
            in: true,
            'amp-bind': `class=>sublist == '${sublist}' ? '${classes.visible}' : '${
              classes.hidden
            }'`
          }
        : { in: item.expanded }
      elements.push(
        <Collapse {...props} timeout="auto" key="collapse">
          <MenuList component="div" classes={{ root: classes.list }}>
            {item.items &&
              item.items.map((item, i) => (
                <Item {...this.props} depth={depth + 1} item={item} key={i} />
              ))}
          </MenuList>
        </Collapse>
      )
    }

    return <Fragment>{elements}</Fragment>
  }

  slideToItem = (item, menu) => {
    const { expandFirstItem } = this.props
    menu.setSelected(item, { expandFirstItem })
  }

  toggleItemExpaned = item => {
    item.toggle()
  }
}
