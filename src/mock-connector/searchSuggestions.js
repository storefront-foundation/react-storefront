/**
 * An example implementation of the API for the SearchPopup component using placeholder data.
 * @param {Object} params
 * @param {String} params.q The search text
 * @return {Object} An object whose shape matches AppModelBase
 */
export default async function searchSuggestions(q, req, res) {
  return {
    text: q,
    groups: [
      {
        caption: 'Suggested Searches',
        ui: 'list',
        links: [`Small ${q}`, `Large ${q}`, `${q} with red stripes`].map(text => ({
          text,
          as: `/search?q=${encodeURIComponent(text)}`,
          href: '/search',
        })),
      },
      {
        caption: 'Suggested Categories',
        ui: 'list',
        links: [
          { text: 'Category 1', href: '/s/[subcategoryId]', as: '/s/1' },
          { text: 'Category 2', href: '/s/[subcategoryId]', as: '/s/2' },
          { text: 'Category 3', href: '/s/[subcategoryId]', as: '/s/3' },
        ],
      },
      {
        caption: 'Suggested Products',
        ui: 'thumbnails',
        links: [
          {
            text: 'Product 1',
            href: '/p/[productId]',
            as: '/p/1?s=1&c=1',
            thumbnail: { src: 'https://dummyimage.com/120x120', alt: 'Product 1' },
          },
          {
            text: 'Product 2',
            href: '/p/[productId]',
            as: '/p/2?s=1&c=1',
            thumbnail: { src: 'https://dummyimage.com/120x120', alt: 'Product 1' },
          },
          {
            text: 'Product 3',
            href: '/p/[productId]',
            as: '/p/3?s=1&c=1',
            thumbnail: { src: 'https://dummyimage.com/120x120', alt: 'Product 1' },
          },
          {
            text: 'Product 4',
            href: '/p/[productId]',
            as: '/p/3?s=1&c=1',
            thumbnail: { src: 'https://dummyimage.com/120x120', alt: 'Product 1' },
          },
          {
            text: 'Product 5',
            href: '/p/[productId]',
            as: '/p/5?s=1&c=1',
            thumbnail: { src: 'https://dummyimage.com/120x120', alt: 'Product 1' },
          },
        ],
      },
    ],
  }
}
