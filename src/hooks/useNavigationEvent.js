import Router from 'next/router'
import { useEffect } from 'react'

export default function useNavigationEvent(cb, deps = []) {
  useEffect(() => {
    Router.events.on('routeChangeStart', cb)
    return () => Router.events.off('routeChangeStart', cb)
  }, [])
}
