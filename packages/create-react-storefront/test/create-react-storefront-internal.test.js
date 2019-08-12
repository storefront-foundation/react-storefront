let createReactStorefrontInternal = require('../src/lib/create-react-storefront-internal')

describe('createReactStorefrontInternal', () => {
  beforeEach(() => {
    jest.doMock('../src/lib/utils', () => ({
      calculateReactStorefrontPath: () => {},
      getProjectName: () => {}
    }))
    jest.doMock('../src/lib/retrieve-template', () => ({
      retrieveTemplate: () => {}
    }))
    jest.doMock('../src/lib/template-processing', () => ({
      processReactStorefrontConfigJsons: () => {},
      processPackageJson: () => {}
    }))
    jest.doMock('../src/lib/install-dependencies', () => () => {})
  })

  describe('when a new directory is not required', () => {
    beforeEach(() => {
      jest.resetModules()
      createReactStorefrontInternal = require('../src/lib/create-react-storefront-internal')
    })

    it('returns true', async () => {
      expect(
        await createReactStorefrontInternal(
          {
            projectName: 'test'
          },
          {
            createDirectory: false
          }
        )
      ).toEqual(true)
    })
  })

  describe('when a new directory is required', () => {
    describe('when the target is valid', () => {
      beforeEach(() => {
        jest.doMock('../src/lib/input-validation', () => ({
          isTargetPathValid: () => {
            return true
          }
        }))
        jest.resetModules()
        createReactStorefrontInternal = require('../src/lib/create-react-storefront-internal')
      })

      describe('with configureUpstream', () => {
        let callCount

        beforeEach(() => {
          callCount = 0

          jest.doMock('../src/lib/template-processing', () => ({
            processReactStorefrontConfigJsons: () => {
              callCount++
            },
            processPackageJson: () => {}
          }))
          jest.resetModules()
          createReactStorefrontInternal = require('../src/lib/create-react-storefront-internal')
        })

        it('returns true', async () => {
          expect(
            await createReactStorefrontInternal(
              {
                projectName: 'test',
                configureUpstream: true
              },
              {
                createDirectory: true
              }
            )
          ).toEqual(true)

          expect(callCount).toEqual(1)
        })
      })

      describe('without configureUpstream', () => {
        beforeEach(() => {
          jest.doMock('../src/lib/template-processing', () => ({
            processReactStorefrontConfigJsons: () => {
              throw 'should never happen'
            },
            processPackageJson: () => {}
          }))
          jest.resetModules()
          createReactStorefrontInternal = require('../src/lib/create-react-storefront-internal')
        })

        it('returns true', async () => {
          expect(
            await createReactStorefrontInternal(
              {
                projectName: 'test'
              },
              {
                createDirectory: true
              }
            )
          ).toEqual(true)
        })
      })
    })

    describe('when the target is invalid', () => {
      beforeEach(() => {
        jest.doMock('../src/lib/input-validation', () => ({
          isTargetPathValid: () => {
            return false
          }
        }))
        jest.resetModules()
        createReactStorefrontInternal = require('../src/lib/create-react-storefront-internal')
      })

      it('returns false', async () => {
        expect(
          await createReactStorefrontInternal(
            {
              projectName: 'test'
            },
            {
              createDirectory: true
            }
          )
        ).toEqual(false)
      })
    })
  })
})
