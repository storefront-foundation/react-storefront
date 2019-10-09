/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import { Component } from 'react'
import PropTypes from 'prop-types'

export default class LeafFooter extends Component {
  static propTypes = {
    render: PropTypes.func
  }

  render() {
    const { render, list } = this.props

    if (render) {
      return render({ list })
    } else {
      return null
    }
  }
}
