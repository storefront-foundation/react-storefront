import colors from './colors'
import capitalize from 'lodash/capitalize'

export default function createFacets() {
  return [
    {
      name: 'Color',
      ui: 'buttons',
      options: Object.keys(colors).map(name => ({
        name: capitalize(name),
        code: `color:${name}`,
        image: {
          src: `https://dummyimage.com/48x48/${colors[name].background}?text=${encodeURIComponent(
            ' ',
          )}`,
          alt: name,
        },
      })),
    },
    {
      name: 'Size',
      ui: 'buttons',
      options: [
        { name: 'SM', code: 'size:sm' },
        { name: 'MD', code: 'size:md' },
        { name: 'LG', code: 'size:lg' },
        { name: 'XL', code: 'size:xl' },
        { name: 'XXL', code: 'size:xxl' },
      ],
    },
    {
      name: 'Type',
      ui: 'checkboxes',
      options: [
        { name: 'New', code: 'type:new', matches: 100 },
        { name: 'Used', code: 'type:used', matches: 20 },
      ],
    },
  ]
}
