export default async function addToCart({ color, size, product }, req, res) {
  const { id, quantity } = product

  console.log('product id: ', id)
  console.log('color id: ', color || 'Not provided')
  console.log('size id: ', size || 'Not provided')
  console.log('quantity ', quantity || 1)

  return { added: true, id }
}
