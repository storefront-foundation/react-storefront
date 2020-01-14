import Router from 'next/router'
import { useEffect } from 'react'

export default function useNavigationEvent(cb, deps = []) {
  useEffect(() => {
    Router.events.on('beforeHistoryChange', cb)
    return () => Router.events.off('beforeHistoryChange', cb)
  }, [])
}
