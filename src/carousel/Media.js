import React from 'react'
import Image from '../Image'
import ReactImageMagnify from 'react-image-magnify'

export default function Media({ magnifyProps, imageProps, src, alt, magnify, type = 'image' }) {
  if (type === 'video') {
    return <video src={src} alt={alt} />
  } else if (magnify) {
    return (
      <ReactImageMagnify
        enlargedImagePosition="over"
        {...magnifyProps}
        smallImage={{
          src: src,
          alt: alt,
          isFluidWidth: true,
        }}
        largeImage={magnify}
      />
    )
  } else {
    return <Image key={src} src={src} alt={alt} fill {...imageProps} />
  }
}
