import { useContext, useMemo } from 'react'
import get from 'lodash/get'
import SessionContext from '../session/SessionContext'

function useCartTotal() {
  const context = useContext(SessionContext)
  const items = get(context, 'session.cart.items', [])
  const total = useMemo(() => items.reduce((totalAcc, item) => item.quantity + totalAcc, 0), [
    items,
  ])
  return total
}

export default useCartTotal
