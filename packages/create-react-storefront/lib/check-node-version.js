const chalk = require('chalk')

module.exports = function checkNodeVersion() {
  const [major] = process.version.substring(1).split(/\./)

  if (major != '8') {
    console.log('')
    console.log(`React Storefront requires node v8. You're running node ${process.version}.`)
    console.log('')
    console.log('To install node 8 using n, run:')
    console.log('')
    console.log('  n 8')
    console.log('')
    process.exit(0)
  }
}
