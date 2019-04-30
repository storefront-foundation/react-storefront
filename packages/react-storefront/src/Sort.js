/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component, Fragment } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { inject, observer } from 'mobx-react'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import PropTypes from 'prop-types'
import Hidden from '@material-ui/core/Hidden'

/**
 * UI for sorting an instance of SearchResultModelBase.  This component can be used on its own, or you can use
 * SortButton to automatically display this component in a drawer that slides up from the bottom of the viewport.
 */
export const styles = theme => ({
  container: {
    padding: '15px 0 0 15px',
  },
  option: {
    boxShadow: 'none',
    width: 'calc(50% - 15px)',
    margin: '0 15px 15px 0',
  },
})

@withStyles(styles, { name: 'RSFSort' })
@inject('router')
@observer
export default class Sort extends Component {
  static propTypes = {
    /**
     * A function to call when a sort option is selected.  The option and event are passed.
     * The default behavior can be prevented by called `preventDefault()` on the passed in event.
     */
    onSelect: PropTypes.func,

    /**
     * A instance of SearchResultsModelBase
     */
    model: PropTypes.object,

    /**
     * The query string parameter that should be updated when the sort is changed.  The value will the
     * code corresponding to the selected sortOption.  Defaults to "sort".
     */
    queryParam: PropTypes.string,

    /**
     * Controls how sort options are displayed.  Can be "menu-items" or "buttons".  Defaults to "buttons"
     */
    variant: PropTypes.oneOf(['menu-items', 'buttons']),
  }

  static defaultProps = {
    onSelect: Function.prototype,
    queryParam: 'sort',
    variant: 'buttons',
  }

  render() {
    const { variant } = this.props

    Hidden

    if (variant === 'buttons') {
      return this.renderButtons()
    } else if (variant === 'menu-items') {
      return this.renderMenu()
    } else {
      return null
    }
  }

  renderButtons() {
    const { model, classes } = this.props
    const options = model.sortOptions

    return (
      <div className={classes.container} onClick={this.handleSort}>
        {options &&
          options.map((option, i) => (
            <Button
              className={classes.option}
              color={model.sort === option.code ? 'primary' : 'default'}
              variant="contained"
              onClick={this.onClick.bind(this, option)}
              key={i}
            >
              {option.name}
            </Button>
          ))}
      </div>
    )
  }

  renderMenu() {
    const { model } = this.props
    const options = model.sortOptions

    return (
      <Fragment>
        {options &&
          options.map((option, i) => (
            <MenuItem key={i} onClick={this.onClick.bind(this, option)}>
              {option.name}
            </MenuItem>
          ))}
      </Fragment>
    )
  }

  onClick = (option, e) => {
    const { onSelect, model, queryParam, router } = this.props
    onSelect(option, e)

    if (!e.isDefaultPrevented()) {
      router.applySearch({ [queryParam]: option.code })
      model.setSort(option)
      model.refresh()
    }
  }
}
