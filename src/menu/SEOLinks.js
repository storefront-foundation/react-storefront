import React from 'react'
import NoScript from '../NoScript'

export default function SEOLinks({ root }) {
  if (!root) return null

  let links = [],
    key = 0

  const findLinks = ({ items }) => {
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
