import React from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MediaCarousel from '../../src/carousel/MediaCarousel'

export default { title: 'MediaCarousel' }

const theme = createMuiTheme({
  margins: {
    container: 16,
  },
})

const media = {
  full: [
    { src: '//placehold.it/400?text=1', alt: 'One', type: 'image' },
    { src: '//placehold.it/400?text=2', alt: 'Two', type: 'image' },
    { src: '//placehold.it/400?text=3', alt: 'Three', type: 'image' },
  ],
  thumbnails: [
    { src: '//placehold.it/200?text=1', alt: 'One', type: 'image' },
    { src: '//placehold.it/200?text=2', alt: 'Two', type: 'image' },
    { src: '//placehold.it/200?text=3', alt: 'Three', type: 'image' },
  ],
  thumbnail: {
    src: '//placehold.it/200?text=1',
    alt: 'One',
  },
}

const slideStyle = {
  width: '100%',
  height: 300,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: 'monospace',
  fontSize: 32,
  color: 'white',
  background: 'grey',
}

const Test = props => {
  return (
    <MuiThemeProvider theme={theme}>
      <MediaCarousel media={media} {...props} />
    </MuiThemeProvider>
  )
}

export const defaults = () => <Test />

export const customMediaComponent = () => (
  <Test MediaComponent={({ src }) => <div style={{ ...slideStyle }}>{src}</div>} />
)

export const customThumbnailsComponent = () => (
  <Test
    CarouselThumbnailsComponent={({ selected }) => {
      return <div style={{ ...slideStyle }}>{selected}</div>
    }}
  />
)

export const noThumbnails = () => <Test thumbnails={false} />
