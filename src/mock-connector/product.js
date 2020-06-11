import fulfillAPIRequest from '..//props/fulfillAPIRequest'
import createProduct from './utils/createProduct'
import createAppData from './utils/createAppData'
import getBase64ForImage from '../utils/getBase64ForImage'

function asciiSum(string = '') {
  return string.split('').reduce((s, e) => s + e.charCodeAt(), 0)
}

export default async function product(params, req, res) {
  const { id, color, size } = params

  const result = await fulfillAPIRequest(req, {
    appData: createAppData,
    pageData: () => getPageData(id),
  })

  // When a query parameter exists, we can fetch custom product data
  // pertaining to specific filters.
  if (color || size) {
    const data = await getPageData(id)
    data.carousel = { index: 0 }
    // A price for the fetched product variant would be included in
    // the response, but for demo purposes only, we are setting the
    // price based on the color name.
    const mockPrice = (asciiSum(color) + asciiSum(size)) / 100
    data.product.price = mockPrice
    data.product.priceText = `$${mockPrice.toFixed(2)}`
    return data
  }

  return result
}

async function getPageData(id) {
  console.log('getPageData')

  const result = {
    title: `Product ${id}`,
    product: createProduct(id),
    breadcrumbs: [
      {
        text: `Home`,
        href: '/',
      },
      {
        text: `Subcategory ${id}`,
        as: `/s/${id}`,
        href: '/s/[subcategoryId]',
      },
    ],
  }

  result.media.full.src = await getBase64ForImage(result.media.full.src)

  return result
}
