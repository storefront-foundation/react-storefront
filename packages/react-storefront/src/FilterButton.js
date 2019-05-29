/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component, Fragment } from 'react'
import { observer, inject } from 'mobx-react'
import ActionButton from './ActionButton'
import Filter from './Filter'
import PropTypes from 'prop-types'
import Drawer from './Drawer'
import withStyles from '@material-ui/core/styles/withStyles'
import classnames from 'classnames'
import grey from '@material-ui/core/colors/grey'
import { Hbox } from './Box'

export const styles = theme => ({
  clear: {
    ...theme.typography.caption,
    padding: 0,
    marginLeft: '10px',
    textDecoration: 'underline'
  },
  clearDisabled: {
    color: grey[400]
  },
  drawer: {
    height: '75vh'
  }
})

/**
 * A button that when clicked, opens a drawer containing the `Filter` view. Current filters
 * are displayed in the button text.
 */
@withStyles(styles, { name: 'RSFFilterButton' })
@inject('app')
@observer
export default class FilterButton extends Component {
  static propTypes = {
    /**
     * An instance of `SearchResultModelBase`
     */
    model: PropTypes.object,

    /**
     * CSS classes
     */
    classes: PropTypes.object,

    /**
     * Props for the underlying `Filter` component
     */
    drawerProps: PropTypes.object,

    /**
     * The label for the button and the drawer header.  Defaults to "Filter".
     */
    title: PropTypes.string,

    /**
     * Set to true to hide the clear link that is shown by default when one or more filters
     * is selected.  Defaults to false.
     */
    hideClearLink: PropTypes.bool,

    /**
     * Text for the clear link.  Defaults to "clear all".
     */
    clearLinkText: PropTypes.string
  }

  static defaultProps = {
    title: 'Filter',
    drawerProps: {},
    hideClearLink: false,
    clearLinkText: 'clear all'
  }

  constructor({ app }) {
    super()

    const openFilter = app.location.search.indexOf('openFilter') !== -1

    this.state = {
      open: openFilter,
      mountDrawer: openFilter
    }
  }

  render() {
    const {
      classes,
      app,
      model,
      title,
      drawerProps,
      hideClearLink,
      clearLinkText,
      ...props
    } = this.props
    const { open, mountDrawer } = this.state
    const { clear, clearDisabled, drawer, ...buttonClasses } = classes
    const pwaPath = app.location.pathname.replace(/\.amp/, '')
    const pwaSearch = app.location.search || ''
    const queryChar = pwaSearch ? '&' : '?'
    const ampUrl = pwaPath + pwaSearch + queryChar + 'openFilter'

    return (
      <Fragment>
        <ActionButton
          label={title}
          href={app.amp ? ampUrl : null}
          value={this.getFilterList()}
          classes={buttonClasses}
          {...props}
          onClick={this.onClick}
        />
        {!app.amp && (
          <Drawer
            ModalProps={{
              keepMounted: true
            }}
            classes={{ paper: classes.drawer }}
            anchor="bottom"
            title={
              <Hbox justifyContent="center">
                <div>{title}</div>
                {hideClearLink || model.filters.length === 0 ? null : (
                  <button
                    className={classnames({
                      [clear]: true,
                      [clearDisabled]: model.loading
                    })}
                    onClick={() => !model.loading && model.clearAllFilters()}
                  >
                    {clearLinkText}
                  </button>
                )}
              </Hbox>
            }
            open={open}
            onRequestClose={this.toggleOpen.bind(this, false)}
          >
            {mountDrawer && (
              <Filter model={model} onViewResultsClick={this.onViewResultsClick} {...drawerProps} />
            )}
          </Drawer>
        )}
      </Fragment>
    )
  }

  onClick = e => {
    if (this.props.onClick) {
      this.props.onClick(e)
    }

    if (!e.defaultPrevented) {
      this.toggleOpen(true)
    }
  }

  toggleOpen = open => {
    this.setState({ open })

    if (open) {
      this.setState({ mountDrawer: true, open: true })
    } else {
      this.setState({ open: false })
    }
  }

  onViewResultsClick = () => {
    this.toggleOpen(false)
  }

  getFilterList = () => {
    const { filters, facetGroups } = this.props.model

    if (!filters || !facetGroups) return null
    if (filters.length > 1) return `${filters.length} selected`

    const names = []
    const selection = {}

    for (let facet of filters) {
      selection[facet] = true
    }

    for (let group of facetGroups) {
      for (let facet of group.facets) {
        if (selection[facet.code]) {
          names.push(facet.name)
        }
      }
    }

    return names.length ? names.join(', ') : null
  }
}
