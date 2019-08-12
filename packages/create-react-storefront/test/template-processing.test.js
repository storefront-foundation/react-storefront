const { execSync } = require('child_process')
const mock = require('mock-require')
const path = require('path')

let templateProcessing = require('../src/lib/template-processing')

describe('JSON processing', () => {
  const testJsonPath = path.resolve(__dirname, 'test-artifacts', 'tmp-jsons')

  before(() => {
    const defaultJsonPath = path.resolve(__dirname, 'test-artifacts', 'default-jsons')
    execSync(`mkdir ${testJsonPath}`)
    execSync(`cp ${defaultJsonPath}/* ${testJsonPath} `)
  })

  after(() => {
    execSync(`rm -rf ${testJsonPath}`)
  })

  describe('processReactStorefrontConfigJsons', () => {
    const values = {
      prodHostname: 'example.com',
      prodUpstream: 'origin.example.com',
      devHostname: 'dev.example.com',
      devUpstream: 'dev-origin.example.com'
    }

    before(() => {
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

    before(() => {
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
  let handleErrorCalled

  beforeEach(() => {
    handleErrorCalled = false

    mock('../src/lib/handle-error', () => {
      handleErrorCalled = true
    })

    templateProcessing = mock.reRequire('../src/lib/template-processing')
  })

  afterEach(() => {
    mock.stopAll()
    templateProcessing = mock.reRequire('../src/lib/template-processing')
  })

  it('calls handleError on error', () => {
    try {
      templateProcessing._readConfigJson(__dirname)
      expect(true).toEqual(false)
    } catch (err) {
      expect(handleErrorCalled).toEqual(true)
    }
  })
})

describe('_writeConfigJson', () => {
  let handleErrorCalled

  beforeEach(() => {
    handleErrorCalled = false

    mock('../src/lib/handle-error', () => {
      handleErrorCalled = true
    })

    templateProcessing = mock.reRequire('../src/lib/template-processing')
  })

  afterEach(() => {
    mock.stopAll()
    templateProcessing = mock.reRequire('../src/lib/template-processing')
  })

  it('calls handleError on error', () => {
    try {
      templateProcessing._writeConfigJson(__dirname, 'not valid json')
      expect(true).toEqual(false)
    } catch (err) {
      expect(handleErrorCalled).toEqual(true)
    }
  })
})
