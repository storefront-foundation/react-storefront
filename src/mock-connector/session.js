export default function session(req, res) {
  return res.json({
    name: 'Mark',
    email: 'mark@domain.com',
    itemsInCart: 0,
    currency: 'USD',
  })
}
