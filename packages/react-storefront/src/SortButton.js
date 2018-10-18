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
     * Props to pass to the underlying `Sort` component.
     */
    drawerProps: PropTypes.object,

    /**
     * Text for the button label and the drawer header.  Defaults to "Sort".
     */
    title: PropTypes.string
  }

  static defaultProps = {
    title: 'Sort',
    drawerProps: {}
  }

  constructor({ app }) {
    super()

    this.state = {
      open: app.location.search.indexOf('openSort') !== -1,
      mountDrawer: false
    }
  }

  render() {
    const { app, model, title, drawerProps, ...props } = this.props
    const { open, mountDrawer } = this.state
    const selectedOption = model.sortOptions.find(o => model.sort === o.code)

    return (
      <Fragment>
        <ActionButton 
          key="button"
          href={ app.amp ? `${app.location.pathname.replace(/\.amp/, '')}?openSort` : null }
          label={title}
          value={selectedOption && selectedOption.name} 
          {...props} 
          onClick={this.onClick}
        />
        {!app.amp && (
          <Drawer 
            ModalProps={{
              keepMounted: true
            }}
            key="drawer"
            anchor="bottom"
            title={title} 
            open={open} 
            onRequestClose={this.toggleOpen.bind(this, false)} 
          >
            {mountDrawer && (
              <Sort model={model} onSelect={this.onSelect} {...drawerProps}/>
            )}
          </Drawer>      
        )}
      </Fragment>
    )
  }

  onClick = (e) => {
    if (this.props.onClick) {
      this.props.onClick(e)
    }

    if (!e.defaultPrevented) {
      this.toggleOpen(true) 
    }
  }

  toggleOpen = (open) => {
    if (open) {
      this.setState({ mountDrawer: true, open: true })
    } else {
      this.setState({ open: false })
    }
  }

  onSelect = () => {
    this.toggleOpen(false)
  }

}

