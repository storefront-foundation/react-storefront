import React, { useContext } from 'react'
import { mount } from 'enzyme'
import { Button } from '@material-ui/core'
import SessionProvider from 'react-storefront/session/SessionProvider'
import SessionContext from 'react-storefront/session/SessionContext'
import { act } from 'react-dom/test-utils'

describe('SessionProvider', () => {
  let wrapper

  beforeEach(() => {
    fetchMock.mockResponseOnce(JSON.stringify({ itemsInCart: 5 }))
  })

  afterEach(() => {
    wrapper.unmount()
    fetchMock.resetMocks()
  })

  const Test = () => {
    const { actions, session } = useContext(SessionContext)

    const updateCart = () => {
      actions.updateCartCount(session.itemsInCart + 1)
    }

    return <Button onClick={updateCart}>{`Total:${session ? session.itemsInCart : 0}`}</Button>
  }

  it('should fetch session data', async () => {
    wrapper = mount(
      <SessionProvider url="/api/session">
        <Test />
      </SessionProvider>,
    )

    expect(wrapper.find(Button).text()).toBe('Total:0')

    await act(async () => {
      await wrapper.update()
    })

    expect(wrapper.find(Button).text()).toBe('Total:5')
  })

  it('should not fetch session data if url is not provided', async () => {
    wrapper = mount(
      <SessionProvider>
        <Test />
      </SessionProvider>,
    )

    expect(wrapper.find(Button).text()).toBe('Total:0')

    await act(async () => {
      await wrapper.update()
    })

    expect(wrapper.find(Button).text()).toBe('Total:0')

    expect(fetchMock).not.toBeCalled()
  })

  describe('actions - updateCartCount', () => {
    it('should update cartCount', async () => {
      wrapper = mount(
        <SessionProvider url="/api/session">
          <Test />
        </SessionProvider>,
      )

      await act(async () => {
        await wrapper.update()
      })

      expect(wrapper.find(Button).text()).toBe('Total:5')
      wrapper.find(Button).simulate('click')

      await act(async () => {
        await wrapper.update()
      })

      expect(wrapper.find(Button).text()).toBe('Total:6')
    })
  })
})
