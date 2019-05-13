/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React, { Component, Fragment } from 'react'
import { observer, inject } from 'mobx-react'
import ListItemText from '@material-ui/core/ListItemText'
import ChevronRight from '@material-ui/icons/ChevronRight'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import MenuContext from './MenuContext'

@inject('app')
@observer
export default class ItemContent extends Component {
  static contextType = MenuContext

  render() {
    let { itemRenderer, ExpandIcon, CollapseIcon, theme, item, leaf, showExpander } = this.props

    const { classes } = this.context

    let contents

    if (itemRenderer) {
      contents = itemRenderer(item, leaf)
    }

    if (contents) {
      return contents
    } else if (leaf) {
      return (
        <Fragment>
          {item.image && (
            <ListItemIcon>
              <img className={classes.listItemImage} alt={item.text} src={item.image} />
            </ListItemIcon>
          )}
          <ListItemText primary={item.text} disableTypography />
        </Fragment>
      )
    } else {
      ExpandIcon = ExpandIcon || theme.ExpandIcon || ExpandMore
      CollapseIcon = CollapseIcon || theme.CollapseIcon || ExpandLess

      return (
        <Fragment>
          {item.image && (
            <ListItemIcon>
              <img className={classes.listItemImage} alt={item.text} src={item.image} />
            </ListItemIcon>
          )}
          <ListItemText primary={item.text} disableTypography />
          <ListItemIcon className={classes.listItemIcon}>
            {showExpander ? (
              item.expanded ? (
                <CollapseIcon className={classes.icon} />
              ) : (
                <ExpandIcon className={classes.icon} />
              )
            ) : (
              <ChevronRight className={classes.icon} />
            )}
          </ListItemIcon>
        </Fragment>
      )
    }
  }
}
