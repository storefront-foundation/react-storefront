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

const startURL = process.env.RSF_URL
const sleepBetweenPages = process.env.RSF_SLEEP_BETWEEN_PAGES || 1000
const headless = process.env.RSF_HEADLESS || 'true'

if (!startURL) {
  console.error(
    'You must set the RSF_URL environment variable to the URL of the app you want to test.'
  )
  console.error('Example: export RSF_URL="https://myapp.moovweb.cloud"')
  process.exit(1)
}

describe('smoke tests', () => {
  jest.setTimeout(30000)
  let driver

  beforeAll(() => {
    driver = createDefaultDriver({ headless })
  })

  afterAll(async () => {
    await driver.quit()
  })

  beforeEach(async () => {
    await driver.sleep(sleepBetweenPages)
  })

  it('Navigate to landing page', async function() {
    await driver.get(startURL)
  })

  it('Navigate to category', async function() {
    await clickElement(driver, '[data-th="nav"]')
  })

  it('Navigate to subcategory', async function() {
    await clickElement(driver, '[data-th="subcategory-link"]')
  })

  it('Navigate to product', async function() {
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

  it('Navigate to checkout', async function() {
    await clickElement(driver, '[data-th="checkout-link"]')
  })
})
