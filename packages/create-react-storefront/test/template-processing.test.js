const { execSync } = require('child_process')
const mock = require('mock-require')
const path = require('path')

let templateProcessing = require('../src/lib/template-processing')

describe('JSON processing', () => {
  const testJsonPath = path.resolve(__dirname, 'test-artifacts', 'tmp-jsons')

  beforeAll(() => {
    const defaultJsonPath = path.resolve(__dirname, 'test-artifacts', 'default-jsons')
    execSync(`mkdir ${testJsonPath}`)
    execSync(`cp ${defaultJsonPath}/* ${testJsonPath} `)
  })

  afterAll(() => {
    execSync(`rm -rf ${testJsonPath}`)
  })

  describe('processReactStorefrontConfigJsons', () => {
    const values = {
      prodHostname: 'example.com',
      prodUpstream: 'origin.example.com',
      devHostname: 'dev.example.com',
      devUpstream: 'dev-origin.example.com'
    }

    beforeAll(() => {
      templateProcessing.processReactStorefrontConfigJsons(testJsonPath, values)
    })

    it('writes the host maps for prod', () => {
      const config = templateProcessing._readConfigJson(
        path.resolve(testJsonPath, 'moov_config-prod.json')
      )

      expect(config.host_map).toEqual(['$.example.com => origin.example.com'])
    })

    it('writes the host maps for dev', () => {
      const config = templateProcessing._readConfigJson(
        path.resolve(testJsonPath, 'moov_config-dev.json')
      )

      expect(config.host_map).toEqual(['$.dev.example.com => dev-origin.example.com'])
    })

    it('writes the host maps for local', () => {
      const config = templateProcessing._readConfigJson(
        path.resolve(testJsonPath, 'moov_config-local.json')
      )

      expect(config.host_map).toEqual(['$.dev.example.com => dev-origin.example.com'])
    })
  })

  describe('processPackageJson', () => {
    const values = {
      version: '1.0.0',
      description: 'description',
      repoUrl: 'example.com/repo',
      author: 'author',
      license: 'UNLICENSED',
      private: true
    }

    beforeAll(() => {
      templateProcessing.processPackageJson('test', testJsonPath, values)
    })

    it('writes package.json properties correctly', () => {
      const expectedPackageJson = {
        name: 'test',
        version: '1.0.0',
        description: 'description',
        homepage: 'example.com/repo',
        author: 'author',
        license: 'UNLICENSED',
        private: true
      }

      const config = templateProcessing._readConfigJson(path.resolve(testJsonPath, 'package.json'))

      expect(config).toEqual(expectedPackageJson)
    })
  })
})

describe('_readConfigJson', () => {
  let mockHandleError

  beforeEach(() => {
    mockHandleError = jest.fn()
    jest.mock('../src/lib/handle-error', () => mockHandleError)
    jest.resetModules()
    templateProcessing = require('../src/lib/template-processing')
  })

  it('calls handleError on error', () => {
    templateProcessing._readConfigJson(__dirname)
    expect(mockHandleError).toHaveBeenCalled()
  })
})

describe('_writeConfigJson', () => {
  let mockHandleError

  beforeEach(() => {
    mockHandleError = jest.fn()
    jest.mock('../src/lib/handle-error', () => mockHandleError)
    jest.resetModules()
    templateProcessing = require('../src/lib/template-processing')
  })

  it('calls handleError on error', () => {
    templateProcessing._writeConfigJson(__dirname, 'not valid json')
    expect(mockHandleError).toHaveBeenCalled()
  })
})
