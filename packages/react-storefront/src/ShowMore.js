/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import withStyles from '@material-ui/core/styles/withStyles'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import VisibilitySensor from 'react-visibility-sensor'

export const styles = theme => ({
  root: {
    margin: '15px 0',
    width: '100%'
  },
  loading: {
    display: 'flex',
    height: 45,
    justifyContent: 'center'
  }
})

/**
 * The ShowMore component controls pagination for views that display a SearchResultsModelBase (specified via the model prop).
 * This component uses either the total or numberOfPages fields on SearchResultsModelBase to determine whether or not
 * to trigger show more. The default variant is a button with text/contents can be changed by specifying a child (string or components).
 * Or this component can be configured to use infinite scrolling for triggering another page.
 */
@withStyles(styles, { name: 'RSFShowMore' })
@inject('app')
@observer
export default class ShowMore extends Component {
  static propTypes = {
    /**
     * A renderer for the loading icon.  Uses CircularPropgress by default
     */
    loading: PropTypes.func,

    /**
     * An instance of `SearchResultModelBase`
     */
    model: PropTypes.object,

    /**
     * CSS classes
     */
    classes: PropTypes.object,

    /**
     * When infiniteScroll is set to true, this prop describes how near to the bottom of the page in pixels the user must scroll before the next page is fetched.
     */
    offset: PropTypes.number,

    /**
     * Set to true to automatically fetch the next page when the user scrolls to the bottom of the page instead of displaying a "Show More" button.
     */
    infiniteScroll: PropTypes.bool
  }

  static defaultProps = {
    Loading: () => <CircularProgress />,
    offset: 100
  }

  onVisibilityChange = isVisible => {
    const { model } = this.props

    if (isVisible && !model.loadingMore) {
      model.showMore()
    }
  }

  onClick = () => {
    const { model } = this.props
    model.showMore()
  }

  render() {
    const {
      app,
      Loading,
      model,
      classes,
      className,
      children,
      infiniteScroll,
      offset,
      ...others
    } = this.props

    if (model.loadingMore) {
      return (
        <div className={classnames(classes.loading, classes.root)}>
          <Loading />
        </div>
      )
    } else if (model.hasMoreItems) {
      if (infiniteScroll && !app.amp) {
        return (
          <VisibilitySensor
            key={model.page}
            offset={{ bottom: -offset }}
            onChange={this.onVisibilityChange}
          >
            <div style={{ width: 1, height: 1 }} />
          </VisibilitySensor>
        )
      }
      return (
        <Button
          variant="contained"
          color="primary"
          href={
            app.amp
              ? `${app.location.pathname.replace(/\.amp/, '')}?page=1#item-${model.pageSize}`
              : null
          }
          className={classnames(classes.root, className)}
          onClick={this.onClick}
          {...others}
        >
          {children || 'Show More'}
        </Button>
      )
    } else {
      return null
    }
  }
}
