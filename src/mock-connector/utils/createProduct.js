import colors, { colorForId } from './colors'
import capitalize from 'lodash/capitalize'
import { loremIpsum } from 'lorem-ipsum'

export default function createProduct(id, numColors = 4) {
  const color = colorForId(id)
  const variants = [color, 'red', 'blue']
  const price = (id % 10) * 10 + 0.99

  return {
    id,
    url: `/p/${id}`,
    name: `Product ${id}`,
    price,
    priceText: `$${price}`,
    rating: (10 - (id % 10)) / 2.0,
    thumbnail: {
      src: `https://dummyimage.com/400x400/${colors[color].background}/${
        colors[color].foreground
      }?text=${encodeURIComponent('Product ' + id)}`,
      alt: `Product ${id}`,
    },
    media: {
      full: variants.map((key, i) => ({
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
      thumbnails: variants.map((key, i) => ({
        src: `https://dummyimage.com/${i === 2 ? 233 : 300}x${i === 1 ? 233 : 300}/${
          colors[key].background
        }/${colors[key].foreground}?text=${encodeURIComponent('Product ' + id)}`,
        alt: `Product ${id}`,
      })),
    },
    sizes: [
      { id: 'sm', text: 'SM' },
      { id: 'md', text: 'MD' },
      { id: 'lg', text: 'LG' },
      { id: 'xl', text: 'XL', disabled: true },
      { id: 'xxl', text: 'XXL' },
    ],
    description: loremIpsum({ count: 10 }),
    specs: loremIpsum({ count: 10 }),
    colors: Object.keys(colors)
      .slice(0, numColors)
      .map((name, idx) => ({
        text: capitalize(name),
        id: name,
        disabled: idx === 2,
        image: {
          src: `https://dummyimage.com/48x48/${colors[name].background}?text=${encodeURIComponent(
            ' ',
          )}`,
          alt: name,
        },
        media: {
          full: [name, name, name].map((key, i) => ({
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
          thumbnails: [name, name, name].map((key, i) => ({
            src: `https://dummyimage.com/${i === 2 ? 300 : 400}x${i === 1 ? 300 : 400}/${
              colors[key].background
            }/${colors[key].foreground}?text=${encodeURIComponent(`Product ${id}`)}`,
            alt: key,
          })),
          thumbnail: [name].map(key => ({
            src: `https://dummyimage.com/400x400/${colors[key].background}/${
              colors[key].foreground
            }?text=${encodeURIComponent('Product ' + id)}`,
            alt: `Product ${id}`,
          }))[0],
        },
      })),
  }
}
