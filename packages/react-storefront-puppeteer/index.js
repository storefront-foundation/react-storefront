const createPage = async (browser, { width = 414, height = 736 } = {}) => {
  const page = await browser.newPage()

  await page.setViewport({
    width: width,
    height: height
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
