let createReactStorefront = require('../src/lib/create-react-storefront')

describe('_calculateStartCommand', () => {
  describe('on windows', () => {
    let originalPlatform

    beforeEach(() => {
      originalPlatform = process.platform
      Object.defineProperty(process, 'platform', {
        value: 'win32'
      })
    })

    afterEach(() => {
      Object.defineProperty(process, 'platform', {
        value: originalPlatform
      })
    })

    it('returns the windows command', () => {
      expect(createReactStorefront._calculateStartCommand()).toEqual('npm run start:windows')
    })
  })

  describe('on other platforms', () => {
    let originalPlatform

    beforeEach(() => {
      originalPlatform = process.platform
      Object.defineProperty(process, 'platform', {
        value: 'not win32'
      })
    })

    afterEach(() => {
      Object.defineProperty(process, 'platform', {
        value: originalPlatform
      })
    })

    it('returns the normal command', () => {
      expect(createReactStorefront._calculateStartCommand()).toEqual('npm start')
    })
  })
})

describe('createReactStorefront', () => {
  let originalConsoleLog, stdOut

  beforeEach(() => {
    stdOut = []

    originalConsoleLog = console.log
    console.log = msg => {
      stdOut.push(msg)
    }
  })

  afterEach(() => {
    console.log = originalConsoleLog
  })

  describe('with incomplete configuration', () => {
    beforeEach(() => {
      jest.mock('../src/lib/prompt-for-config', () => ({
        promptForConfig: () => {
          throw new Error('User configuration is incomplete. Aborting.')
        }
      }))

      jest.resetModules()

      createReactStorefront = require('../src/lib/create-react-storefront')
    })

    it('returns early', async () => {
      await createReactStorefront.createReactStorefront({ projectName: 'test' })
      expect(stdOut[0]).toContain('incomplete')
    })
  })

  describe('with a project name', () => {
    beforeEach(() => {
      jest.mock('../src/lib/prompt-for-config', () => ({
        promptForConfig: () => {
          return {}
        }
      }))
    })

    describe('when creation succeeds', () => {
      beforeEach(() => {
        jest.mock('../src/lib/create-react-storefront-internal', () => () => true)
        jest.resetModules()
        createReactStorefront = require('../src/lib/create-react-storefront')
      })

      it('logs success', async () => {
        await createReactStorefront.createReactStorefront({ projectName: 'test' })
        expect(stdOut[0]).toContain('created')
      })
    })

    describe('when creation fails', () => {
      beforeEach(() => {
        jest.mock('../src/lib/create-react-storefront-internal', () => () => false)
        jest.resetModules()
        createReactStorefront = require('../src/lib/create-react-storefront')
      })

      it('does not log', async () => {
        await createReactStorefront.createReactStorefront({ projectName: 'test' })
        expect(stdOut.length).toEqual(0)
      })
    })
  })
})
