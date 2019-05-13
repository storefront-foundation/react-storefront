/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React, { Component, Fragment } from 'react'
import { observer, inject } from 'mobx-react'
import Link from '../Link'

@inject('app')
@observer
export default class SEOLinks extends Component {
  render() {
    const levels = this.props.app.menu.levels
    const root = levels.length && levels[0]

    if (!root) return null

    let links = [],
      key = 0

    const findLinks = ({ items }) => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i]

        if (item.url) {
          links.push(<li key={key++}>{/* <Link to={item.url}>{item.text}</Link> */}</li>)
        }

        if (item.items) {
          findLinks(item)
        }
      }
    }

    findLinks(root)

    return (
      <Fragment>
        {/* 
        React doesn't execute the children of a noscript on the client, 
        therefore the style rules for Link will get written out of order
        unless we force a Link to render here.
        */}
        <div style={{ display: 'none' }}>
          <Link />
        </div>
        <noscript>
          <ul>{links}</ul>
        </noscript>
      </Fragment>
    )
  }
}
