import React from 'react'
import Menu from '../../src/menu/Menu'

export default { title: 'Menu' }

export const open = () => (
  <Menu
    open
    root={{
      text: 'category',
      items: [
        {
          text: 'item 1',
          href: '/foo',
          as: '/foo',
          items: [{ text: 'bar', href: '/bar', as: '/bar' }],
        },
        {
          text: 'item 2',
          href: '/foo2',
          as: '/foo2',
        },
      ],
    }}
  />
)
