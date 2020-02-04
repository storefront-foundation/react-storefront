import React from 'react'
import Carousel from '../../src/carousel/Carousel'

export default { title: 'Carousel' }

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

export const withArrows = () => <Carousel arrows="all">{slides}</Carousel>

export const noIndicators = () => <Carousel indicators={false}>{slides}</Carousel>

export const autoplay = () => <Carousel autoplay>{slides}</Carousel>

export const customInterval = () => (
  <Carousel autoplay interval={1000}>
    {slides}
  </Carousel>
)
