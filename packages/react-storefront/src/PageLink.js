import React, { Component } from 'react'
import Link from './Link'
import PropTypes from 'prop-types'
import { isAlive } from 'mobx-state-tree'

/**
 * A link to a page that automatically set AppModelBase.loading{props.Page}
 * This component wraps moov-pwa/Link and supports all of its props.
 */
export default class PageLink extends Component {

  static propTypes = {
    /**
     * An instance of a mobx-state-tree Model to link to
     */
    model: PropTypes.object.isRequired,

    /**
     * The page to display when clicked.
     */
    page: PropTypes.string.isRequired
  }

  render() {
    let { model, page, ...others } = this.props
    return <Link to={model.url} state={this.createState} {...others} />
  }

  createState = () => {
    let { page, model } = this.props

    if (isAlive(model)) {
      if (typeof model.createLinkState === 'function') {
        model = model.createLinkState()
      } else if (typeof model.toJSON === 'function') {
        model = model.toJSON()
      }
  
      return {
        page, 
        [`loading${page}`]: {
          id: model.id + '-loading',
          ...model
        }
      }
    }
  }
}