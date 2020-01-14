/**
 * Executes the callback and returns its result while logging the execution time to the console.
 * @param {String} label A string to preface the console.log
 * @param {Function} cb A function to execute
 * @return {Object} The result of the function
 */
export default function profile(label, cb) {
  if (process.env.NODE_ENV === 'production') {
    return cb()
  } else {
    const start = new Date().getTime()
    const result = cb()
    const end = new Date().getTime()
    console.log(label, `${end - start} ms`)
    return result
  }
}

global.rsf_profile = profile
