import createProduct from './utils/createProduct'

export default async function session(req, res) {
  const products = [createProduct(1), createProduct(2), createProduct(3)]

  return {
    name: 'Mark',
    email: 'mark@domain.com',
    cart: {
      items: products.map((item, i) => ({
        ...item,
        quantity: 1,
      })),
    },
    currency: 'USD',
  }
}
