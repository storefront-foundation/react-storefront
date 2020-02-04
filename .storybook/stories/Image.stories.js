import React from 'react'
import Image from '../../src/Image'

export default { title: 'Image' }

const styles = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: 500,
}

export const lazy = () => (
  <div style={{ fontSize: 30, textAlign: 'center' }}>
    Please scroll down
    <div>
      <div style={styles}>
        <Image src="//placehold.it/300?text=1" lazy />
      </div>
      <div style={styles}>
        <Image src="//placehold.it/300?text=2" lazy />
      </div>
      <div style={styles}>
        <Image src="//placehold.it/300?text=3" lazy />
      </div>
      <div style={styles}>
        <Image src="//placehold.it/300?text=4" lazy />
      </div>
    </div>
  </div>
)
