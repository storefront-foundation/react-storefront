const mock = require('mock-require')
const prompts = require('prompts')

let promptForConfig = require('../src/lib/prompt-for-config')

describe('_initialDevHostname', () => {
  it('adds a prefix to the production hostname', () => {
    expect(
      promptForConfig._initialDevHostname(undefined, {
        prodHostname: 'example.com'
      })
    ).toEqual('dev.example.com')
  })
})

describe('_initialDevUpstream', () => {
  it('modifies the prefix of the dev hostname', () => {
    expect(
      promptForConfig._initialDevUpstream(undefined, {
        devHostname: 'dev.example.com'
      })
    ).toEqual('dev-origin.example.com')
  })
})

describe('_initialProdUpstream', () => {
  it('adds a prefix to the production hostname', () => {
    expect(
      promptForConfig._initialProdUpstream(undefined, {
        prodHostname: 'example.com'
      })
    ).toEqual('origin.example.com')
  })
})

describe('_requireInput', () => {
  describe('with a value', () => {
    it('returns true', () => {
      expect(promptForConfig._requireInput('value')).toEqual(true)
    })

    describe('with an empty value', () => {
      it('returns an error message', () => {
        expect(promptForConfig._requireInput(' ')).toContain('required')
      })
    })
  })

  describe('without a value', () => {
    it('returns an error message', () => {
      expect(promptForConfig._requireInput(undefined)).toContain('required')
    })
  })
})

describe('promptForConfig', () => {
  describe('with all input', () => {
    describe('with configureProxy set', () => {
      it('returns the proper input options', async () => {
        const values = {
          prodHostname: 'example.com',
          prodUpstream: 'origin.example.com',
          devHostname: 'dev.example.com',
          devUpstream: 'dev-origin.example.com',
          version: '1.0.0',
          description: 'description',
          repoUrl: 'example.com/repo',
          author: 'author',
          license: 'UNLICENSED',
          private: true,
          createDirectory: true
        }

        prompts.inject(values)
        const returnedValues = await promptForConfig.promptForConfig(true)
        expect(returnedValues).toEqual(values)
      })
    })

    it('returns the proper input options', async () => {
      const values = {
        version: '1.0.0',
        description: 'description',
        repoUrl: 'example.com/repo',
        author: 'author',
        license: 'UNLICENSED',
        private: true,
        createDirectory: true
      }

      prompts.inject(values)
      const returnedValues = await promptForConfig.promptForConfig()
      expect(returnedValues).toEqual(values)
    })
  })

  describe('with incomplete input in the default section', () => {
    beforeEach(() => {
      jest.mock('prompts', () => () => ({}))
      jest.resetModules()
      promptForConfig = require('../src/lib/prompt-for-config')
    })

    it('throws an error', async () => {
      try {
        await promptForConfig.promptForConfig()
        expect(true).toBe(false)
      } catch (err) {
        expect(err.message).toContain('incomplete')
      }
    })
  })

  describe('with incomplete input in the upstream section', () => {
    beforeEach(() => {
      mock('prompts', () => {
        return {
          key1: '',
          key2: '',
          key3: '',
          key4: '',
          key5: '',
          key6: '',
          key7: ''
        }
      })

      promptForConfig = mock.reRequire('../src/lib/prompt-for-config')
    })

    afterEach(() => {
      mock.stopAll()
      promptForConfig = mock.reRequire('../src/lib/prompt-for-config')
    })

    it('throws an error', async () => {
      try {
        await promptForConfig.promptForConfig(true)
        expect(true).toEqual(false)
      } catch (err) {
        expect(err.message).toContain('incomplete')
      }
    })
  })
})
