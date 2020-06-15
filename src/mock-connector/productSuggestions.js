import createProduct from './utils/createProduct'

/**
 * An example endpoint that returns mock product suggestions for a PDP.
 * @param {*} req
 * @param {*} res
 */
export default async function productSuggestions(req, res) {
  const products = []

  for (let i = 1; i <= 10; i++) {
    products.push(createProduct(i))
  }

  return products
}
