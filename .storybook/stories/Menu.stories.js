import React from 'react'
import Menu from '../../src/menu/Menu'

export default { title: 'Menu' }

const root = {
  text: 'category',
  items: [
    { text: 'item1', href: '/item1', as: '/item1', items: [] },
    { text: 'item2', href: '/item2', as: '/item2' },
    { text: 'item3', href: '/item3', as: '/item3' },
  ],
}

export const open = () => <Menu open root={root} />
