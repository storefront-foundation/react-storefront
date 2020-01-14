import React, { useEffect } from 'react'
import { mount } from 'enzyme'
import useLocalStorage from 'react-storefront/hooks/useLocalStorage'

describe('useLocalStorage.test', () => {
  let wrapper

  beforeEach(() => {})

  afterEach(() => {
    wrapper.unmount()
    window.localStorage.removeItem('value')
  })

  describe('getValue', () => {
    it('should return the default value when none is present', () => {
      let theValue

      const Test = () => {
        const [value, setValue] = useLocalStorage('value', 1)
        theValue = value
        return null
      }

      wrapper = mount(<Test />)

      expect(theValue).toBe(1)
    })

    it('should return the stored value when one is present', () => {
      window.localStorage.setItem('value', JSON.stringify(2))

      let theValue

      const Test = () => {
        const [value, setValue] = useLocalStorage('value', 1)
        theValue = value
        return null
      }

      wrapper = mount(<Test />)

      expect(theValue).toBe(2)
    })

    it('should log errors when the item is not valid json', () => {
      window.localStorage.setItem('value', '{')

      const Test = () => {
        const [value, setValue] = useLocalStorage('value', 1)
        return null
      }

      const spy = jest.spyOn(console, 'log').mockImplementation()

      expect(() => {
        wrapper = mount(<Test />)
      }).not.toThrowError()

      expect(spy).toHaveBeenCalledWith(expect.any(Error))
    })
  })

  describe('setValue', () => {
    it('should store a value', () => {
      const Test = () => {
        const [value, setValue] = useLocalStorage('value', 1)

        useEffect(() => {
          setValue(2)
        }, [])

        return null
      }

      wrapper = mount(<Test />)

      expect(window.localStorage.getItem('value')).toBe('2')
    })

    it('should accept a function', () => {
      const Test = () => {
        const [value, setValue] = useLocalStorage('value', 1)

        useEffect(() => {
          setValue(current => current + 1)
        }, [])

        return null
      }

      wrapper = mount(<Test />)

      expect(window.localStorage.getItem('value')).toBe('2')
    })

    it('should log errors', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation()

      const Test = () => {
        const [value, setValue] = useLocalStorage('value', 1)

        useEffect(() => {
          const v = {}
          v.self = v
          setValue(v)
        }, [])

        return null
      }

      expect(() => {
        wrapper = mount(<Test />)
      }).not.toThrowError()

      expect(spy).toHaveBeenCalledWith(expect.any(Error))
    })
  })
})
