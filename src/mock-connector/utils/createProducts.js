import createProduct from './createProduct'

export default function createProducts(count, page = 0) {
  const products = []

  let start = page * count

  for (let i = 0; i < count; i++) {
    products.push(createProduct(start + i + 1))
  }

  return products
}
