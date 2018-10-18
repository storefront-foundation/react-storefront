/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/'
import { inject, observer } from 'mobx-react'
import classnames from 'classnames'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'

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
  }
});

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
    queryParam: PropTypes.string
  }

  static defaultProps = {
    onSelect: Function.prototype,
    queryParam: 'sort'
  }

  render() {
    const { model, classes } = this.props
    const options = model.sortOptions

    return (
      <div className={classes.container} onClick={this.handleSort}>
        {options && options.map((option, i) => (
          <Button
            className={classes.option}
            color={model.sort === option.code ? 'primary' : 'default'}
            variant="raised"
            onClick={this.onClick.bind(this, option)}
            key={i}
          >
            {option.name}
          </Button>
        ))}
      </div>
    )
  }

  onClick = (option, e) => {
    this.props.onSelect(option, e)

    if (!e.isDefaultPrevented()) {
      this.props.router.applySearch({
        [this.props.queryParam]: option.code
      })
    }
  }

}
