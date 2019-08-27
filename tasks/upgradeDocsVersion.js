const fs = require('fs')

// Current RSF version
const version = require('../lerna.json').version

// Upgrade docs RSF dependency version to current
const docsPackage = require('../docs/package.json')
docsPackage.devDependencies['react-storefront'] = version
docsPackage.devDependencies['react-storefront-moov-xdn'] = version

// Write it
fs.writeFileSync(__dirname + '/../docs/package.json', JSON.stringify(docsPackage, null, 2))
