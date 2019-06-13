/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React, { Component, Fragment } from 'react'
import { observer, inject } from 'mobx-react'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import MenuContext from './MenuContext'
import ExpanderIcon from './ExpanderIcon'

@inject('app')
@observer
export default class ItemContent extends Component {
  static contextType = MenuContext

  render() {
    let { itemTextRenderer, item, leaf } = this.props

    const { classes } = this.context

    let contents

    if (itemTextRenderer) {
      contents = itemTextRenderer(item, leaf)
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
      return (
        <Fragment>
          {item.image && (
            <ListItemIcon>
              <img className={classes.listItemImage} alt={item.text} src={item.image} />
            </ListItemIcon>
          )}
          <ListItemText className={classes.listItem} primary={item.text} disableTypography />
          <ListItemIcon className={classes.listItemIcon}>
            <ExpanderIcon {...this.props} />
          </ListItemIcon>
        </Fragment>
      )
    }
  }
}
