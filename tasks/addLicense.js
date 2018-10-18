/**
 * Adds the copyright license to all JS source files.  This is run with a pre-commit hook
 * configured in package.json
 */

const glob = require('glob').sync
const fs = require('fs')
const path = require('path')
const license = `
/**
 * @license
 * Copyright © 2017-${new Date().getFullYear()} Moov Corporation.  All rights reserved.
 */ 
`.trim() + '\n'

const files = glob('packages/*/src/**/*.js')

for (let file of files) {
  const fullPath = `${path.join(process.cwd(), file)}`
  const contents = fs.readFileSync(fullPath, 'utf8')
  
  if (!contents.startsWith('/**\n * @license')) {
    console.log(`adding license to ${fullPath}`)
    fs.writeFileSync(fullPath, license + contents, 'utf8')
  }
}
