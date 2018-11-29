const copyFileSync = require('fs').copyFileSync;
const findIndexFiles  = require('create-index').findIndexFiles;

// Get created index files
const created = findIndexFiles(__dirname + '/../src', { silent: true }).map(path => path + '/index.js');

// Copy to lib
created.forEach(path => copyFileSync(
	path,
	path.replace('src', 'lib').replace('index.js', 'index.es.js')
));

console.log('Copied', created.length, 'indexes.');