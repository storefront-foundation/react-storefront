import React, { useContext } from 'react'
import { mount } from 'enzyme'
import SessionContext from 'react-storefront/session/SessionContext'
import { act } from 'react-dom/test-utils'

describe('SessionProvider', () => {
  let wrapper,
    SessionProvider,
    actions,
    session,
    sessionResponse = { signedIn: false, cart: { items: [{ id: '1', name: 'Red Shoe' }] } }

  beforeEach(() => {
    session = {}
    fetchMock.mockOnce(JSON.stringify(sessionResponse))
    SessionProvider = require('react-storefront/session/SessionProvider').default
  })

  afterEach(() => {
    wrapper.unmount()
    fetchMock.resetMocks()
  })

  const Test = () => {
    const context = useContext(SessionContext)
    actions = context.actions
    session = context.session
    return null
  }

  describe('mount', () => {
    it('should fetch session data', async () => {
      wrapper = mount(
        <SessionProvider url="/api/session">
          <Test />
        </SessionProvider>,
      )
      expect(session).toEqual({
        signedIn: false,
        cart: {
          items: [],
        },
      })
      await act(async () => await wrapper.update())
      expect(session).toEqual(sessionResponse)
    })

    it('should not fetch session data if url is not provided', async () => {
      wrapper = mount(
        <SessionProvider>
          <Test />
        </SessionProvider>,
      )
      await act(async () => await wrapper.update())
      expect(session).toEqual({
        signedIn: false,
        cart: {
          items: [],
        },
      })
    })
  })

  describe('signIn', () => {
    it('should call the signIn api and update the session', async () => {
      wrapper = mount(
        <SessionProvider url="/api/session">
          <Test />
        </SessionProvider>,
      )

      await act(async () => {
        let request
        fetchMock.mockOnce(async req => {
          request = req
          return JSON.stringify({ signedIn: true })
        })
        await actions.signIn({ email: 'user@domain.com', password: 'password' })
        expect(request.url).toBe('/api/signIn')
        expect(request.method).toBe('POST')
        expect(request.body.toString('utf8')).toEqual(
          JSON.stringify({ email: 'user@domain.com', password: 'password' }),
        )
        expect(session.signedIn).toBe(true)
      })
    })

    it('should throw an error when the response is not ok', async () => {
      wrapper = mount(
        <SessionProvider url="/api/session">
          <Test />
        </SessionProvider>,
      )

      await act(async () => {
        let error
        fetchMock.resetMocks()
        fetchMock.mockOnce(async () => JSON.stringify({ error: 'test' }), { status: 500 })

        try {
          debugger
          await actions.signIn({ email: 'user@domain.com', password: 'password' })
        } catch (e) {
          error = e
        }

        expect(error.message).toBe('test')
        expect(session.signedIn).toBe(false)
      })
    })
  })

  describe('signOut', () => {
    it('should call the signOut api and update the session', async () => {
      wrapper = mount(
        <SessionProvider url="/api/session">
          <Test />
        </SessionProvider>,
      )

      await act(async () => {
        session.signedIn = true
        let request
        fetchMock.mockOnce(async req => {
          request = req
          return JSON.stringify({ signedIn: false })
        })
        await actions.signOut()
        expect(request.url).toBe('/api/signOut')
        expect(request.method).toBe('POST')
        expect(session.signedIn).toBe(false)
      })
    })

    it('should throw an error when the response is not ok', async () => {
      wrapper = mount(
        <SessionProvider url="/api/session">
          <Test />
        </SessionProvider>,
      )

      await act(async () => {
        let error
        fetchMock.mockOnce(async () => JSON.stringify({ error: 'test' }), { status: 500 })

        try {
          await actions.signOut()
        } catch (e) {
          error = e
        }

        expect(error.message).toBe('test')
      })
    })
  })

  describe('signUp', () => {
    it('should call the signUp api and update the session', async () => {
      wrapper = mount(
        <SessionProvider url="/api/session">
          <Test />
        </SessionProvider>,
      )

      await act(async () => {
        let request

        fetchMock.mockOnce(async req => {
          request = req
          return JSON.stringify({ signedIn: true })
        })

        await actions.signUp({
          firstName: 'Joe',
          lastName: 'Smith',
          email: 'user@domain.com',
          password: 'password',
          someOtherField: 'foo',
        })

        expect(request.url).toBe('/api/signUp')
        expect(request.method).toBe('POST')
        expect(request.body.toString('utf8')).toEqual(
          JSON.stringify({
            firstName: 'Joe',
            lastName: 'Smith',
            email: 'user@domain.com',
            password: 'password',
            someOtherField: 'foo',
          }),
        )
        expect(session.signedIn).toBe(true)
      })
    })

    it('throw an error if the response is not ok', async () => {
      wrapper = mount(
        <SessionProvider url="/api/session">
          <Test />
        </SessionProvider>,
      )

      await act(async () => {
        let error
        fetchMock.mockOnce(async () => JSON.stringify({ error: 'test' }), { status: 500 })

        try {
          await actions.signUp({
            firstName: 'Joe',
            lastName: 'Smith',
            email: 'user@domain.com',
            password: 'password',
            someOtherField: 'foo',
          })
        } catch (e) {
          error = e
        }

        expect(error.message).toBe('test')
        expect(session.signedIn).toBe(false)
      })
    })
  })

  describe('addToCart', () => {
    it('should call api/cart/add and apply the result to the session', async () => {
      wrapper = mount(
        <SessionProvider url="/api/session">
          <Test />
        </SessionProvider>,
      )

      await act(async () => {
        let request

        fetchMock.mockOnce(async req => {
          request = req
          return JSON.stringify({ signedIn: true })
        })

        await actions.addToCart({
          product: { id: '1', name: 'Red Dress' },
          quantity: 1,
          someOtherParam: 'foo',
        })

        expect(request.url).toBe('/api/cart/add')
        expect(request.method).toBe('POST')
        expect(request.body.toString('utf8')).toEqual(
          JSON.stringify({
            product: { id: '1', name: 'Red Dress' },
            quantity: 1,
            someOtherParam: 'foo',
          }),
        )
        expect(session.signedIn).toBe(true)
      })
    })

    it('throw an error if the response is not ok', async () => {
      wrapper = mount(
        <SessionProvider url="/api/session">
          <Test />
        </SessionProvider>,
      )

      await act(async () => {
        let error
        fetchMock.mockOnce(async () => JSON.stringify({ error: 'test' }), { status: 500 })

        try {
          await actions.addToCart({
            product: { id: '1', name: 'Red Dress' },
            quantity: 1,
            someOtherParam: 'foo',
          })
        } catch (e) {
          error = e
        }

        expect(error.message).toBe('test')
      })
    })
  })

  describe('updateCart', () => {
    it('should call api/cart/update and apply the result to the session', async () => {
      wrapper = mount(
        <SessionProvider url="/api/session">
          <Test />
        </SessionProvider>,
      )

      await act(async () => {
        let request

        fetchMock.mockOnce(async req => {
          request = req
          return JSON.stringify({ signedIn: true })
        })

        await actions.addToCart({
          product: { id: '1', name: 'Red Dress' },
          quantity: 1,
          someOtherParam: 'foo',
        })

        expect(request.url).toBe('/api/cart/add')
        expect(request.method).toBe('POST')
        expect(request.body.toString('utf8')).toEqual(
          JSON.stringify({
            product: { id: '1', name: 'Red Dress' },
            quantity: 1,
            someOtherParam: 'foo',
          }),
        )
        expect(session.signedIn).toBe(true)
      })
    })

    it('throw an error if the response is not ok', async () => {
      wrapper = mount(
        <SessionProvider url="/api/session">
          <Test />
        </SessionProvider>,
      )

      await act(async () => {
        let error
        fetchMock.mockOnce(async () => JSON.stringify({ error: 'test' }), { status: 500 })

        try {
          await actions.addToCart({
            product: { id: '1', name: 'Red Dress' },
            quantity: 1,
            someOtherParam: 'foo',
          })
        } catch (e) {
          error = e
        }

        expect(error.message).toBe('test')
      })
    })
  })
})
