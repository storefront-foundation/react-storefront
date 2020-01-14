/**
 * Returns a promise that returns after `ms` milliseconds
 * @param {Number} ms The delay in milliseconds
 * @return {Promise}
 */
export default function sleep(ms = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}
