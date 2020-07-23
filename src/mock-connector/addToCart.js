export default async function addToCart(product, quantity, req, res) {
  const { id, color, size } = product

  console.log('product id: ', id)
  console.log('color id: ', color || 'Not provided')
  console.log('size id: ', size || 'Not provided')
  console.log('quantity ', quantity)

  return {}
}
