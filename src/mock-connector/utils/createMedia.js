import colors from './colors'

export default function createMedia(id, color) {
  return {
    full: [color].map((key, i) => ({
      src: `https://dummyimage.com/${i === 2 ? 400 : 600}x${i === 1 ? 400 : 600}/${
        colors[key].background
      }/${colors[key].foreground}?text=${encodeURIComponent('Product ' + id)}`,
      alt: `Product ${id}`,
      magnify: {
        height: i === 1 ? 800 : 1200,
        width: i === 2 ? 800 : 1200,
        src: `https://dummyimage.com/${i === 2 ? 800 : 1200}x${i === 1 ? 800 : 1200}/${
          colors[key].background
        }/${colors[key].foreground}?text=${encodeURIComponent('Product ' + id)}`,
      },
    })),
    thumbnails: [color].map((key, i) => ({
      src: `https://dummyimage.com/${i === 2 ? 300 : 400}x${i === 1 ? 300 : 400}/${
        colors[key].background
      }?text=${encodeURIComponent(`Product ${id}`)}`,
      alt: key,
    })),
  }
}
