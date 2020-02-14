import React from 'react'
import { withKnobs, boolean, number, select } from '@storybook/addon-knobs'
import Carousel from '../../src/carousel/Carousel'

export default { title: 'Carousel', decorators: [withKnobs] }

const slideStyle = {
  width: '100%',
  height: 300,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: 'monospace',
  fontSize: 32,
  color: 'white',
}

const slides = [
  <div style={{ ...slideStyle, background: '#eb3b5a' }}>Red</div>,
  <div style={{ ...slideStyle, background: '#2d98da' }}>Blue</div>,
  <div style={{ ...slideStyle, background: '#26de81' }}>Green</div>,
]

export const options = () => (
  <Carousel
    indicators={boolean('Indicators', true)}
    autoplay={boolean('Autoplay')}
    interval={number('Interval', 1000)}
    arrows={select('Arrows', { None: false, Desktop: 'desktop', All: 'all' }, 'all')}
  >
    {slides}
  </Carousel>
)
