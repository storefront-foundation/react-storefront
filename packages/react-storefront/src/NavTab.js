/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import Track from './Track'
import Link from './Link'
import Tab from '@material-ui/core/Tab'
import withStyles from '@material-ui/core/styles/withStyles'
import { observer } from 'mobx-react'
import { lazyState } from './utils/state'

export const styles = theme => ({
  root: {
    height: '56px',
    [theme.breakpoints.up('md')]: {
      minWidth: '130px'
    }
  },
  clickEl: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1
  },
  label: {
    whiteSpace: 'nowrap'
  },
  link: {
    display: 'block',
    height: '100%',
    fontSize: theme.typography.body1.fontSize
  },
  menu: {
    padding: `${theme.margins.container}px`
  },
  menuItem: {
    padding: `1em ${theme.margins.container}px`
  }
})

@withStyles(styles, { name: 'RSFNavTab' })
@observer
export default class NavTab extends Component {

  render() {
    const { classes, state, url, prefetch, text, item } = this.props

    return (
      <Track event="topNavClicked" item={item}>
        <Link
          state={lazyState(state)}
          className={classes.link}
          to={url}
          prefetch={prefetch}
          onClick={this.props.onClick}
          anchorProps={{
            onMouseEnter: this.onMouseEnter,
            onMouseLeave: this.props.onMouseLeave,
            "data-th": "topNavClicked"
          }}
        >
          <Tab
            className={classes.root}
            label={text}
            classes={{
              label: classes.label
            }}
          />
        </Link>
      </Track>
    )
  }

  onMouseEnter = (e) => {
    this.props.onMouseEnter({
      target: e.currentTarget,
      menu: this.getMenu()
    })
  }

  getMenu() {
    const { children, item, classes, onItemClick } = this.props

    if (children) {
      return children
    } else if (item.items && item.items.length) {
      return  (
        <div className={classes.menu}>
          {item.items.map((item, i) => (
            <div key={i} className={classes.menuItem}>
              <Link to={item.url} onClick={onItemClick}>{item.text}</Link>
            </div>
          ))}
        </div>
      )
    } else {
      return null
    }
  }

}