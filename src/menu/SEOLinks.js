import React from 'react'
import PropTypes from 'prop-types'
import NoScript from '../NoScript'

function SEOLinks({ root }) {
  if (!root) return null

  const links = []
  let key = 0

  const findLinks = ({ items }) => {
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      const item = items[i]

      if (item.href) {
        links.push(
          <a key={key++} href={item.as}>
            {item.text}
          </a>,
        )
      }

      if (item.items) {
        findLinks(item)
      }
    }
  }

  findLinks(root)

  return (
    <NoScript>
      <nav
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '1px',
          width: '1px',
          overflow: 'hidden',
        }}
      >
        {links}
      </nav>
    </NoScript>
  )
}

const itemShape = {
  as: PropTypes.string,
  href: PropTypes.string,
}

itemShape.items = PropTypes.arrayOf(PropTypes.shape(itemShape))
const root = PropTypes.shape(itemShape)

SEOLinks.propTypes = {
  root,
}

export default SEOLinks
