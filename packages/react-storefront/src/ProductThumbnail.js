/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { observer } from 'mobx-react'
import Image from './Image'

/**
 *
 * The `ProductThumbnail` component renders the given Product's selected thumbnail image.
 * It uses the selected color option's `thumbnail` property as the source of the image.
 *
 * You can customize this property when building your product model data in the handlers.
 *
 */
@observer
export default class ProductThumbnail extends React.Component {
  render() {
    const { product, ...props } = this.props
    const color = `rsfProduct${product.id}.color`
    return (
      <Image
        {...props}
        src={product.color.selected.thumbnail || product.thumbnail}
        amp-bind={`src=>${color}.selected.thumbnail || "${product.thumbnail}"`}
      />
    )
  }
}
