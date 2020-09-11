import { addItem } from './utils/cartStore'

export default async function addToCart({ color, size, product, quantity }, req, res) {
  return { cart: { items: addItem(product.id, quantity, req, res) } }
}
