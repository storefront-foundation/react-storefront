import { updateItem } from './utils/cartStore'

export default function updateCartItem(item, quantity, req, res) {
  return { cart: { items: updateItem(item.id, quantity, req, res) } }
}
