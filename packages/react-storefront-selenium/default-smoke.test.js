/**
 * This is the default smoke test run by Apollo when the Moovweb XDN Github app is not
 * installed, or the app does not have a `ci:smoke` script in package.json.
 *
 * We rely on elements with `data-th` attributes to guide the selenium test script through the
 * shopping flow.
 *
 * The hostname of the app to be tested is specified in the required environment variable `RSF_HOST`.
 */

require('chromedriver')

const {
  createDefaultDriver,
  clickElement,
  findVisibleElements,
  waitForElement
} = require('./index')

const hostToTest = process.env.RSF_HOST

if (!hostToTest) {
  console.error(
    'You must set the RSF_HOST environment variable to the hostname of the app you want to test.'
  )
  console.error('Example: export RSF_HOST="myapp.moovweb.cloud"')
  process.exit(1)
}

describe('smoke tests', () => {
  jest.setTimeout(30000)
  let driver

  beforeAll(() => {
    driver = createDefaultDriver()
  })

  afterAll(async () => {
    await driver.quit()
  })

  it('Navigate to landing page', async function() {
    const protocol = hostToTest.startsWith('localhost') ? 'http' : 'https'
    await driver.get(`${protocol}://${hostToTest}`)
  })

  it('Navigate to category', async function() {
    await clickElement(driver, '[data-th="nav"]')
  })

  it('navigate to subcategory', async function() {
    await clickElement(driver, '[data-th="subcategory-link"]')
  })

  it('navigate to product', async function() {
    await clickElement(driver, '[data-th="product-link"]')
  })

  it('Add product to cart ', async function() {
    await clickElement(driver, '[data-th="add-to-cart"]')
  })

  it('Navigate to cart', async function() {
    await clickElement(driver, '[data-th="cart-link"]')
  })

  it('Verify product in cart', async function() {
    await waitForElement(driver, '[data-th="product-link"]')
    const products = await findVisibleElements(driver, '[data-th="product-link"]')
    expect(products).toHaveLength(1)
  })

  it('navigate to checkout', async function() {
    await clickElement(driver, '[data-th="checkout-link"]')
  })
})
