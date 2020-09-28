import fulfillAPIRequest from '../props/fulfillAPIRequest'
import createAppData from './utils/createAppData'
import { getProducts } from './utils/cartStore'

export default async function cart(req, res) {
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
          items: getProducts(req, res),
        },
      }),
  })
}
