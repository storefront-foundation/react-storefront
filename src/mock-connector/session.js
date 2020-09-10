import { getProducts } from './utils/cartStore'

export default async function session(req, res) {
  return {
    name: 'Mark',
    email: 'mark@domain.com',
    cart: {
      items: getProducts(req, res),
    },
    currency: 'USD',
  }
}
