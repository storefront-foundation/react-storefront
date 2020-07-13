import React from 'react'
import useCartTotal from 'react-storefront/hooks/useCartTotal'
import SessionContext from 'react-storefront/session/SessionContext'
import { mount } from 'enzyme'

describe('useCartTotal', () => {
  it('should return the total count of items in the cart', () => {
    let total

    const session = {
      cart: {
        items: [{ quantity: 2 }, { quantity: 3 }],
      },
    }
    const Test = () => {
      total = useCartTotal()
      return <div>{total}</div>
    }

    mount(
      <SessionContext.Provider value={{ session }}>
        <Test />
      </SessionContext.Provider>,
    )

    expect(total).toBe(5)
  })
})
