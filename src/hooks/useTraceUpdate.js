import { useEffect, useRef } from 'react'

export default function useTraceUpdate(props) {
  const prev = useRef(null)

  useEffect(() => {
    if (prev.current != null) {
      // don't output during initial render

      const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
        if (prev.current[k] !== v) {
          ps[k] = [prev.current[k], v]
        }
        return ps
      }, {})

      if (Object.keys(changedProps).length > 0) {
        console.log('Changed props:', changedProps)
      } else {
        console.log('nothing changed')
      }
    }

    prev.current = props
  })
}

if (process.env.NODE_ENV !== 'production') {
  global.useTraceUpdate = useTraceUpdate
}
