import { useEffect } from 'react'

export default function useJssStyles() {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')

    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }, [])
}
