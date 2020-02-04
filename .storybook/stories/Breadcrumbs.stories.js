import React from 'react'
import Breadcrumbs from '../../src/Breadcrumbs'

export default { title: 'Breadcrumbs' }

export const defaults = () => (
  <Breadcrumbs
    items={[
      { text: 'one', href: '/one' },
      { text: 'two', href: '/two' },
      { text: 'three', href: '/three' },
      { text: 'four', href: '/four' },
    ]}
  />
)
