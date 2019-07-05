import { renderInitialStateScript, getScripts } from '../src/renderers'

describe('renderers', () => {
  describe('getScripts', () => {
    describe('with source maps', () => {
      it('should return only the js files', () => {
        const stats = {
          assetsByChunkName: {
            main: ['main.js', 'main.js.map']
          }
        }
        expect(getScripts({ stats, chunk: 'main' })).toEqual(['/pwa/main.js'])
      })
    })
    describe('without source maps', () => {
      it('should return only the js files', () => {
        const stats = {
          assetsByChunkName: {
            main: 'main.js'
          }
        }
        expect(getScripts({ stats, chunk: 'main' })).toEqual(['/pwa/main.js'])
      })
    })
  })

  describe('renderInitialStateScript', () => {
    it('should render window.initialState and window.initialRouteData', () => {
      const result = renderInitialStateScript({
        state: { toJSON: () => ({ initialState: true }) },
        routeData: { initialRouteData: true }
      })

      expect(result.replace(/\s/g, '')).toEqual(
        (
          '<script type="text/javascript">' +
          'window.initialState=Object.freeze({"initialState":true})' +
          'window.initialRouteData=Object.freeze({"initialRouteData":true})' +
          '</script>'
        ).replace(/\s/g, '')
      )
    })

    it('should accept overridden names for initialState and initialRouteData', () => {
      const result = renderInitialStateScript({
        state: { toJSON: () => ({ initialState: true }) },
        routeData: { initialRouteData: true },
        initialStateProperty: 'state',
        initialRouteDataProperty: 'routeData'
      })

      expect(result.replace(/\s/g, '')).toEqual(
        (
          '<script type="text/javascript">' +
          'window.state=Object.freeze({"initialState":true})' +
          'window.routeData=Object.freeze({"initialRouteData":true})' +
          '</script>'
        ).replace(/\s/g, '')
      )
    })

    it('should not throw an error when rendering a null route result', () => {
      const result = renderInitialStateScript({
        state: { toJSON: () => ({ initialState: true }) },
        routeData: null,
        initialStateProperty: 'state',
        initialRouteDataProperty: 'routeData'
      })

      expect(result.replace(/\s/g, '')).toEqual(
        (
          '<script type="text/javascript">' +
          'window.state=Object.freeze({"initialState":true})' +
          'window.routeData=Object.freeze({})' +
          '</script>'
        ).replace(/\s/g, '')
      )
    })
  })
})
