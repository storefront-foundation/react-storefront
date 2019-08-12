const { execSync } = require('child_process')
const fs = require('fs')
const mock = require('mock-require')
const path = require('path')

let retrieveTemplate = require('../src/lib/retrieve-template')

// Timeout is extended for this block to prevent network hiccups from causing
// failures.
describe('retrieveTemplate', () => {
  before(async () => {
    await retrieveTemplate.retrieveTemplate(path.resolve(__dirname, 'tmp'))
  })

  after(() => {
    const tmpPath = path.resolve(__dirname, 'tmp')
    execSync(`rm -rf ${tmpPath}`)
  })

  it('deletes the downloaded file', () => {
    expect(fs.existsSync(path.resolve(__dirname, 'moov_pwa_template.zip'))).toEqual(false)
  })

  it('unzips without an extra folder in the path', () => {
    expect(fs.existsSync(path.resolve(__dirname, 'tmp', 'package.json'))).toEqual(true)
  })
}).timeout(10000)

describe('_deleteTemplate', () => {
  let handleErrorCalled

  beforeEach(() => {
    handleErrorCalled = false

    mock('../src/lib/handle-error', () => {
      handleErrorCalled = true
    })

    retrieveTemplate = mock.reRequire('../src/lib/retrieve-template')
  })

  afterEach(() => {
    mock.stopAll()
    retrieveTemplate = mock.reRequire('../src/lib/retrieve-template')
  })

  it('calls handleError on error', () => {
    try {
      retrieveTemplate._deleteTemplate()
      expect(true).toEqual(false)
    } catch (err) {
      expect(handleErrorCalled).toEqual(true)
    }
  })
})

describe('_downloadTemplate', () => {
  let handleErrorCalled

  beforeEach(() => {
    handleErrorCalled = false

    mock('../src/lib/handle-error', () => {
      handleErrorCalled = true
    })

    mock('download', () => {
      throw 'error'
    })

    retrieveTemplate = mock.reRequire('../src/lib/retrieve-template')
  })

  afterEach(() => {
    mock.stopAll()
    retrieveTemplate = mock.reRequire('../src/lib/retrieve-template')
  })

  it('calls handleError on error', () => {
    try {
      retrieveTemplate._downloadTemplate()
      expect(true).toEqual(false)
    } catch (err) {
      expect(handleErrorCalled).toEqual(true)
    }
  })
})

describe('_unzipTemplate', () => {
  let handleErrorCalled

  beforeEach(() => {
    handleErrorCalled = false

    mock('../src/lib/handle-error', () => {
      handleErrorCalled = true
    })

    retrieveTemplate = mock.reRequire('../src/lib/retrieve-template')
  })

  afterEach(() => {
    mock.stopAll()
    retrieveTemplate = mock.reRequire('../src/lib/retrieve-template')
  })

  it('calls handleError on error', async () => {
    try {
      await retrieveTemplate._unzipTemplate(undefined)
      expect(true).toEqual(false)
    } catch (err) {
      expect(handleErrorCalled).toEqual(true)
    }
  })
})
