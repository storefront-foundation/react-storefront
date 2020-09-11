import { removeItem } from './utils/cartStore'

export default async function removeCartItem(item, req, res) {
  return { cart: { items: removeItem(item.id, req, res) } }
}
