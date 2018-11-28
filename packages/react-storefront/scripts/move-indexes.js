const renameSync = require('fs').renameSync;
const findIndexFiles  = require('create-index').findIndexFiles;

// Get created index files
const created = findIndexFiles(__dirname + '/../src', { silent: true }).map(path => path + '/index.js');

// Move to lib
created.forEach(path => renameSync(path, path.replace('src', 'lib')));
