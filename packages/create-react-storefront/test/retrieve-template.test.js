const { execSync } = require('child_process')
const fs = require('fs')
const mock = require('mock-require')
const path = require('path')

let retrieveTemplate = require('../src/lib/retrieve-template')

describe('retrieve-template', () => {
  let mockHandleError

  beforeEach(() => {
    mockHandleError = jest.fn()
    jest.mock('../src/lib/handle-error', () => mockHandleError)
    jest.resetModules()
    retrieveTemplate = require('../src/lib/retrieve-template')
  })

  describe('retrieveTemplate', () => {
    beforeEach(() => {
      jest.setTimeout(1000000)
    })

    afterEach(() => {
      const tmpPath = path.resolve(__dirname, 'tmp')
      execSync(`rm -rf ${tmpPath}`)
    })

    it('deletes the downloaded file', async () => {
      await retrieveTemplate.retrieveTemplate(path.resolve(__dirname, 'tmp'))
      expect(fs.existsSync(path.resolve(__dirname, 'moov_pwa_template.zip'))).toEqual(false)
    })

    it('unzips without an extra folder in the path', async () => {
      await retrieveTemplate.retrieveTemplate(path.resolve(__dirname, 'tmp'))
      expect(fs.existsSync(path.resolve(__dirname, 'tmp', 'package.json'))).toEqual(true)
    })
  })

  describe('_deleteTemplate', () => {
    it('calls handleError on error', () => {
      retrieveTemplate._deleteTemplate()
      expect(mockHandleError).toHaveBeenCalled()
    })
  })

  describe('_downloadTemplate', () => {
    beforeEach(() => {
      jest.mock('download', () => () => Promise.reject(new Error('mock download error')))
      jest.resetModules()
      retrieveTemplate = require('../src/lib/retrieve-template')
    })

    afterEach(() => {
      jest.unmock('download')
    })

    it('calls handleError on error', async () => {
      await retrieveTemplate._downloadTemplate()
      expect(mockHandleError).toHaveBeenCalled()
    })
  })

  describe('_unzipTemplate', () => {
    it('calls handleError on error', async () => {
      await retrieveTemplate._unzipTemplate(undefined)
      expect(mockHandleError).toHaveBeenCalled()
    })
  })
})
