/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import ButtonSelector from './ButtonSelector'
import AmpState from './amp/AmpState'

/**
 *
 * The `ProductColors` component renders a given Product's color options within a ButtonSelector.
 * It also handles the AMP state for the particular product, such as updating the accompanying thumbnail image.
 *
 */
export default function ProductColors({ product, ...props }) {
  return (
    <AmpState id={`rsfProduct${product.id}`} initialState={product.toJSON()}>
      <ButtonSelector small name="color" {...props} model={product.color} />
    </AmpState>
  )
}
