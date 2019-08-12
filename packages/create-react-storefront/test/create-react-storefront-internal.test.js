const mock = require('mock-require')

let createReactStorefrontInternal = require('../src/lib/create-react-storefront-internal')

describe('createReactStorefrontInternal', () => {
  beforeEach(() => {
    mock('../src/lib/utils', {
      calculateReactStorefrontPath: () => {},
      getProjectName: () => {}
    })
    mock('../src/lib/retrieve-template', {
      retrieveTemplate: () => {}
    })
    mock('../src/lib/template-processing', {
      processReactStorefrontConfigJsons: () => {},
      processPackageJson: () => {}
    })
    mock('../src/lib/install-dependencies', () => {})
  })

  afterEach(() => {
    mock.stopAll()
    createReactStorefrontInternal = mock.reRequire('../src/lib/create-react-storefront-internal')
  })

  describe('when a new directory is not required', () => {
    beforeEach(() => {
      createReactStorefrontInternal = mock.reRequire('../src/lib/create-react-storefront-internal')
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
        mock('../src/lib/input-validation', {
          isTargetPathValid: () => {
            return true
          }
        })
        createReactStorefrontInternal = mock.reRequire(
          '../src/lib/create-react-storefront-internal'
        )
      })

      describe('with configureUpstream', () => {
        let callCount

        beforeEach(() => {
          callCount = 0

          mock('../src/lib/template-processing', {
            processReactStorefrontConfigJsons: () => {
              callCount++
            },
            processPackageJson: () => {}
          })

          createReactStorefrontInternal = mock.reRequire(
            '../src/lib/create-react-storefront-internal'
          )
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
          mock('../src/lib/template-processing', {
            processReactStorefrontConfigJsons: () => {
              throw 'should never happen'
            },
            processPackageJson: () => {}
          })

          createReactStorefrontInternal = mock.reRequire(
            '../src/lib/create-react-storefront-internal'
          )
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
        mock('../src/lib/input-validation', {
          isTargetPathValid: () => {
            return false
          }
        })
        createReactStorefrontInternal = mock.reRequire(
          '../src/lib/create-react-storefront-internal'
        )
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
