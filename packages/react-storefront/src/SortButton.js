/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component, Fragment } from 'react'
import { observer, inject } from 'mobx-react'
import ActionButton from './ActionButton'
import Sort from './Sort'
import PropTypes from 'prop-types'
import Drawer from './Drawer'
import Hidden from '@material-ui/core/Hidden'
import Menu from '@material-ui/core/Menu'

/**
 * A button that when clicked, opens a drawer containing the `Sort` view. The name of the currently
 * selected sortOption is display in the button text.
 */
@inject('app')
@observer
export default class SortButton extends Component {
  static propTypes = {
    /**
     * A instance of SearchResultsModelBase
     */
    model: PropTypes.object,

    /**
     * CSS classes
     */
    classes: PropTypes.object,

    /**
     * Sets the type of control displayed when the menu is clicked
     */
    variant: PropTypes.oneOf(['drawer', 'menu']),

    /**
     * Props to pass to the underlying `Sort` component.
     */
    drawerProps: PropTypes.object,

    /**
     * Text for the button label and the drawer header.  Defaults to "Sort".
     */
    title: PropTypes.string,
  }

  static defaultProps = {
    title: 'Sort',
    variant: 'drawer',
    drawerProps: {},
  }

  constructor({ app, variant }) {
    super()

    const open = variant === 'drawer' && app.location.search.indexOf('openSort') !== -1

    this.state = {
      open,
      mountDrawer: open,
      anchorEl: null,
    }
  }

  render() {
    const { app, variant, model, title, drawerProps, ...props } = this.props
    const { open, mountDrawer, anchorEl } = this.state
    const selectedOption = model.sortOptions.find(o => model.sort === o.code)

    return (
      <Fragment>
        <ActionButton
          key="button"
          href={app.amp ? `${app.location.pathname.replace(/\.amp/, '')}?openSort` : null}
          label={title}
          value={selectedOption && selectedOption.name}
          {...props}
          onClick={this.onClick}
        />
        {!app.amp && variant === 'drawer' && (
          <Hidden smUp>
            <Drawer
              ModalProps={{
                keepMounted: true,
              }}
              key="drawer"
              anchor="bottom"
              title={title}
              open={open}
              onRequestClose={this.toggleOpen.bind(this, false)}
            >
              {mountDrawer && <Sort model={model} onSelect={this.onSelect} {...drawerProps} />}
            </Drawer>
          </Hidden>
        )}
        {!app.amp && variant === 'menu' && (
          <Hidden xsDown>
            <Menu open={open} anchorEl={anchorEl} onClose={this.close}>
              <Sort variant="menu-items" model={model} onSelect={this.onSelect} />
            </Menu>
          </Hidden>
        )}
      </Fragment>
    )
  }

  onClick = e => {
    if (this.props.onClick) {
      this.props.onClick(e)
    }

    if (!e.defaultPrevented) {
      this.toggleOpen(true, e.currentTarget)
    }
  }

  close = () => {
    this.toggleOpen(false)
  }

  toggleOpen = (open, anchorEl) => {
    if (open) {
      this.setState({ mountDrawer: true, open: true, anchorEl })
    } else {
      this.setState({ open: false, anchorEl: null })
    }
  }

  onSelect = () => {
    this.toggleOpen(false)
  }
}
