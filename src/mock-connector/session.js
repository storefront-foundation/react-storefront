export default async function session(req, res) {
  return {
    name: 'Mark',
    email: 'mark@domain.com',
    itemsInCart: 0,
    currency: 'USD',
  }
}
