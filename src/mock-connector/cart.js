import createProduct from './utils/createProduct'
import fulfillAPIRequest from '../props/fulfillAPIRequest'
import createAppData from './utils/createAppData'

export default async function cart(req, res) {
  const products = [createProduct(1), createProduct(2), createProduct(3)]

  return fulfillAPIRequest(req, {
    appData: createAppData,
    pageData: () =>
      Promise.resolve({
        title: 'My Cart',
        breadcrumbs: [
          {
            text: 'Home',
            href: '/',
          },
        ],
        cart: {
          items: products.map((item, i) => ({
            ...item,
            quantity: 1,
          })),
        },
      }),
  })
}
