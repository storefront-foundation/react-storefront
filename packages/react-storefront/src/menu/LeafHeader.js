/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ListItem from '@material-ui/core/ListItem'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

export default class LeafHeader extends Component {
  static propTypes = {
    render: PropTypes.func,
    goBack: PropTypes.func,
    classes: PropTypes.object.isRequired,
    list: PropTypes.shape({
      text: PropTypes.string
    }).isRequired
  }

  render() {
    const { render, classes, goBack, list, parentPath } = this.props

    const backButtonAmpProps = {
      on: `tap:AMP.setState({ rsfMenu: { list: '${parentPath}' } })`
    }

    if (render) {
      return render({ list, goBack, backButtonAmpProps })
    } else {
      return (
        <ListItem divider button onClick={goBack} {...backButtonAmpProps}>
          <ListItemIcon classes={{ root: classes.header }}>
            <ChevronLeft className={classes.icon} />
          </ListItemIcon>
          <ListItemText
            classes={{ root: classes.headerText }}
            primary={<div className={classes.headerText}>{list.text} </div>}
          />
        </ListItem>
      )
    }
  }
}
