/**
 * Creates a browser page with mobile viewport size and disables analytics
 * @param {Browser} browser
 * @param {Object} options
 * @param {Object} options.width The width of the viewport.
 * @param {Object} options.height The height of the viewport.
 * @param {String} options.url The base URL for cookies
 * @return {Object} A page
 */
const createPage = async (
  browser,
  { width = 414, height = 736, url = process.env.RSF_SMOKE_TEST_URL } = {}
) => {
  const page = await browser.newPage()

  await page.setViewport({
    width: width,
    height: height
  })

  await page.setCookie({
    name: 'rsf_disable_analytics',
    value: 'true',
    url
  })

  return page
}

const clickElement = async (page, selector) => {
  await page.waitForSelector(selector, { visible: true })
  return await page.click(selector, { waitUntil: 'networkidle0' })
}

module.exports = {
  createPage,
  clickElement
}
