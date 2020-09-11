import createProduct from './createProduct'

const CART_COOKIE = 'rsf_mock_cart'

const initialStore = [
  { id: 1, quantity: 1 },
  { id: 2, quantity: 1 },
]

function getStore(req, res) {
  if (!req.cookies[CART_COOKIE]) {
    res.setHeader('Set-Cookie', `${CART_COOKIE}=${JSON.stringify(initialStore)}; Path=/`)
  }
  const store = req.cookies[CART_COOKIE] || initialStore
  try {
    return JSON.parse(store)
  } catch (err) {
    console.log('Failed parsing store from cookie', req.cookies[CART_COOKIE])
    return []
  }
}

function toProduct({ id, quantity }) {
  return { ...createProduct(id), quantity }
}

export function getProducts(req, res) {
  return getStore(req, res).map(toProduct)
}

export function updateItem(id, quantity, req, res) {
  const newStore = [...getStore(req, res)]
  const item = newStore.find(e => e.id === id)
  item.quantity = quantity
  res.setHeader('Set-Cookie', `${CART_COOKIE}=${JSON.stringify(newStore)}; Path=/`)
  return newStore.map(toProduct)
}

export function removeItem(id, req, res) {
  const newStore = [...getStore(req, res)].filter(e => e.id !== id)
  res.setHeader('Set-Cookie', `${CART_COOKIE}=${JSON.stringify(newStore)}; Path=/`)
  return newStore.map(toProduct)
}

export function addItem(id, quantity, req, res) {
  const newStore = [{ id, quantity }, ...getStore(req, res)]
  res.setHeader('Set-Cookie', `${CART_COOKIE}=${JSON.stringify(newStore)}; Path=/`)
  return newStore.map(toProduct)
}
