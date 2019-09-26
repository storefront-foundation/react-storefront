/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */

import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import IconButton from '@material-ui/core/IconButton'
import Search from '@material-ui/icons/Search'
import { inject, observer } from 'mobx-react'

export const styles = theme => ({
  icon: {
    color: theme.palette.action.active
  },
  large: {
    fontSize: '28px'
  }
})

@withStyles(styles, { name: 'RSFSearchButton' })
@inject(({ app: { search } }) => ({ search }))
@observer
export default class SearchButton extends Component {
  render() {
    const { children, classes, search, ...other } = this.props
    return (
      <IconButton
        aria-label="Search"
        color="inherit"
        classes={{ label: classes.large }}
        onClick={() => search.toggle(true)}
        on="tap:AMP.setState({ rsfSearchDrawer: { open: true }})"
        {...other}
      >
        {children || <Search className={classes.icon} />}
      </IconButton>
    )
  }
}
