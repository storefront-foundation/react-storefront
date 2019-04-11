/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
/**
 * Since Track calls analytics target methods in a setImmediate to allow the model to update and react to rerender before
 * analytics events are fired, this helper function ensures that analytics events have been given time to fire
 * before assertions are made
 *
 * Example:
 *
 *  return waitForAnalytics(() => expect(cartClicked).toHaveBeenCalled())
 *
 * @param {Function} cb The callback function containing assertions
 */
export default function waitForAnalytics(cb) {
  return new Promise((resolve, reject) => {
    setImmediate(() => {
      try {
        cb()
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  })
}
