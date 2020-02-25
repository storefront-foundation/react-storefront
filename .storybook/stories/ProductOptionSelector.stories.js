import React, { useState } from 'react'
import ProductOptionSelector from '../../src/option/ProductOptionSelector'
import SwatchProductOption from '../../src/option/SwatchProductOption'

export default { title: 'ProductOptionSelector' }

const colors = [
  {
    text: 'Red',
    id: 'red',
    image: {
      src: 'https://via.placeholder.com/48x48/f44336?text=%20',
      alt: 'red',
    },
  },
  {
    text: 'Green',
    id: 'green',
    image: {
      src: 'https://via.placeholder.com/48x48/4caf50?text=%20',
      alt: 'green',
    },
  },
  {
    text: 'Blue',
    id: 'blue',
    image: {
      src: 'https://via.placeholder.com/48x48/2196f3?text=%20',
      alt: 'blue',
    },
  },
  {
    text: 'Grey',
    id: 'grey',
    image: {
      src: 'https://via.placeholder.com/48x48/e0e0e0?text=%20',
      alt: 'grey',
    },
  },
]

export const swatch = () => {
  const [color, setColor] = useState(colors[0])

  return (
    <ProductOptionSelector options={colors} value={color} onChange={color => setColor(color)} />
  )
}

export const text = () => {
  const [color, setColor] = useState(colors[0])

  return (
    <ProductOptionSelector
      options={colors}
      value={color}
      onChange={color => setColor(color)}
      variant="text"
    />
  )
}
