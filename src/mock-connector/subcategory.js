import createFacets from './utils/createFacets'
import createSortOptions from './utils/createSortOptions'
import createProduct from './utils/createProduct'
import colors, { indexForColor } from './utils/colors'
import fulfillAPIRequest from 'react-storefront/props/fulfillAPIRequest'
import createAppData from './utils/createAppData'

export default async function subcategory(params, req, res) {
  let { q, slug = '1', page = 0, filters, sort, more = false } = params

  if (filters) {
    filters = JSON.parse(filters)
  } else {
    filters = []
  }

  return await fulfillAPIRequest(req, {
    appData: createAppData,
    pageData: () =>
      Promise.resolve({
        id: slug,
        name: q != null ? `Results for "${q}"` : `Subcategory ${slug}`,
        title: q != null ? `Results for "${q}"` : `Subcategory ${slug}`,
        total: 100,
        page: parseInt(page),
        totalPages: 5,
        filters,
        sort,
        sortOptions: createSortOptions(),
        facets: createFacets(),
        products: filterProducts(page, filters, more),
        breadcrumbs: [
          {
            text: `Home`,
            href: '/',
          },
        ],
      }),
  })
}

function filterProducts(page, filters, more) {
  const products = []
  const filteredColors = filters
    ? filters.filter(f => f.startsWith('color')).map(f => f.replace(/^color:/, ''))
    : []
  const count = more ? 20 : 10

  while (products.length < count) {
    if (filteredColors && filteredColors.length) {
      for (let color of filteredColors) {
        const index = indexForColor(color)

        const colorGap = i => Math.floor((page * count) / filteredColors.length) + i

        products.push(
          ...Array.from({ length: count }, (v, i) => colorGap(i)).map(i =>
            createProduct('' + (i * Object.keys(colors).length + index)),
          ),
        )
      }
    } else {
      const id = page * 10 + products.length + 1
      products.push(createProduct(id + ''))
    }
  }

  return products.sort((a, b) => a.id - b.id).slice(0, count)
}
