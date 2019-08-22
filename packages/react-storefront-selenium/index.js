const { Builder, By } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')

const defaultWaitForElementTimeout = 10000

const isDisplayedAndEnabled = async (driver, selector) => {
  const elements = await driver.findElements(By.css(selector))

  for (const element of elements) {
    const isDisplayed = await element.isDisplayed()
    const isEnabled = await element.isEnabled()

    if (isDisplayed && isEnabled) {
      return true
    }
  }

  return false
}

const createDefaultDriver = ({ headless = 'true' } = {}) => {
  const chromeOptions = new chrome.Options()

  chromeOptions.addArguments('disable-infobars')
  chromeOptions.addArguments('disable-extensions')
  chromeOptions.addArguments('no-sandbox')
  chromeOptions.addArguments('disable-dev-shm-usage')
  chromeOptions.addArguments('disable-gpu')
  chromeOptions.setUserPreferences({ credential_enable_service: false })

  if (headless === 'true') {
    chromeOptions.addArguments('headless')
  }

  chromeOptions.windowSize({
    width: 414,
    height: 736
  })

  return new Builder()
    .setChromeOptions(chromeOptions)
    .forBrowser('chrome')
    .build()
}

const findVisibleElements = async (driver, selector) => {
  const elements = await driver.findElements(By.css(selector))
  const response = []

  for (const element of elements) {
    const isDisplayed = await element.isDisplayed()

    if (isDisplayed) {
      response.push(element)
    }
  }

  return response
}

const waitForElement = (driver, selector, timeout = defaultWaitForElementTimeout) => {
  return driver.wait(() => isDisplayedAndEnabled(driver, selector), timeout)
}

const clickElement = async (driver, selector, timeout = defaultWaitForElementTimeout) => {
  await waitForElement(driver, selector, timeout)

  const elements = await driver.findElements(By.css(selector))

  for (const element of elements) {
    const isDisplayed = await element.isDisplayed()

    if (isDisplayed) {
      return element.click()
    }
  }
}

module.exports = {
  createDefaultDriver,
  waitForElement,
  findVisibleElements,
  clickElement
}
