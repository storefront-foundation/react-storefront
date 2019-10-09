import { getMode } from '../src/manifest'

describe('getMode', () => {
  it('should return default in development', () => {
    global.env = {}
    expect(getMode()).toEqual({ id: '000-000-000', name: 'default' })
  })

  it('should return the mode corresponding to moov_mode_name in production', () => {
    global.moovManifest = {
      Modes: {
        xxx: {
          Name: 'modeA'
        },
        yyy: {
          Name: 'modeB'
        }
      }
    }

    global.env = {
      moov_mode_name: 'modeB'
    }

    expect(getMode()).toEqual({ id: 'yyy', name: 'modeB' })
  })
})
