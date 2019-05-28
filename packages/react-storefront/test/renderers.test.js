import { renderInitialStateScript } from '../src/renderers'

describe('renderers', () => {
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
  })
})
