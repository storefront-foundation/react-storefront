/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React, { Component, Fragment } from 'react'
import { observer, inject } from 'mobx-react'
import ChevronRight from '@material-ui/icons/ChevronRight'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import MenuContext from './MenuContext'

@inject('app')
@observer
export default class ExpanderIcon extends Component {
  static contextType = MenuContext

  render() {
    let {
      app: { amp },
      ExpandIcon,
      CollapseIcon,
      theme,
      showExpander,
      sublist,
      item
    } = this.props

    const { classes } = this.context

    ExpandIcon = ExpandIcon || theme.ExpandIcon || ExpandMore
    CollapseIcon = CollapseIcon || theme.CollapseIcon || ExpandLess

    if (!showExpander) return <ChevronRight className={classes.icon} />

    if (amp) {
      return (
        <Fragment>
          <CollapseIcon
            className={classes.icon}
            amp-bind={`class=>rsfMenu.sublist == '${sublist}' ? '${classes.visible} ${
              classes.icon
            }' : '${classes.hidden} ${classes.icon}'`}
          />
          <ExpandIcon
            className={classes.icon}
            amp-bind={`class=>rsfMenu.sublist == '${sublist}' ? '${classes.hidden} ${
              classes.icon
            }' : '${classes.visible} ${classes.icon}'`}
          />
        </Fragment>
      )
    } else {
      return item.expanded ? (
        <CollapseIcon className={classes.icon} />
      ) : (
        <ExpandIcon className={classes.icon} />
      )
    }
  }
}
