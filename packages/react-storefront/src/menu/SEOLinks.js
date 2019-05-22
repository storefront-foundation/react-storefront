/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React, { Component, Fragment } from 'react'
import { observer, inject } from 'mobx-react'
import Link from '../Link'
import NoScript from '../NoScript'

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
          links.push(
            <Link key={key++} to={item.url}>
              {item.text}
            </Link>
          )
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
        <NoScript>
          <nav
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '1px',
              width: '1px',
              overflow: 'hidden'
            }}
          >
            {links}
          </nav>
        </NoScript>
      </Fragment>
    )
  }
}
