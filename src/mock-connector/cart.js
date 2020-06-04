import createProduct from './utils/createProduct'
import withAmpFormParser from '../middlewares/withAmpFormParser'

const cart = (req, res) => {
  console.log('method', req.method)
  console.log('body', req.body)

  if (req.method === 'POST') {
    const { id, color, size, quantity } = req.body
    console.log('product id: ', id)
    console.log('color id: ', color || 'Not provided')
    console.log('size id: ', size || 'Not provided')
    console.log('quantity ', quantity)

    if (req.query['__amp_source_origin']) {
      res.setHeader('AMP-Redirect-To', `${req.query['__amp_source_origin']}/cart`)
    }

    setTimeout(() => {
      res.end(JSON.stringify({ response: 'success', cartCount: 4 }))
    }, 1)
  } else {
    const products = [createProduct(1), createProduct(2), createProduct(3)]

    res.end(
      JSON.stringify({
        pageData: { items: products.map((item, i) => ({ ...item, quantity: i + 1 })) },
      }),
    )
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default withAmpFormParser(cart)
