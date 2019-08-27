const puppeteer = require('puppeteer')

const defaultWaitForElementTimeout = 100000

const createBrowser = async ({ headless = 'true' } = {}) => {
  const options = {}
  options.headless = 'true' === headless
  return await puppeteer.launch(options)
}

const createPage = async (browser, { width = 414, height = 736 } = {}) => {
  const page = await browser.newPage()

  await page.setViewport({
    width: width,
    height: height
  })

  return page
}

const clickElement = async (page, selector) => {
  return await page.click(selector, { waitUntil: 'networkidle0' })
}

module.exports = {
  createBrowser,
  createPage,
  clickElement
}
