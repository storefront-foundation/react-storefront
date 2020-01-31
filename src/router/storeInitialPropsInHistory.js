/**
 * Patches `history.pushState` and `history.replaceState` to stores the props of the
 * current main component in `history.state` before navigating.  This allows us to instantly
 * render the main component when the user goes back
 */
export default function storeInitialPropsInHistory() {
  if (typeof window === 'undefined') return

  const { replaceState } = window.history

  history.replaceState = (data, title, url) => {
    let { state } = history
    if (!state) state = {}
    replaceState.call(history, { rsf: state.rsf, ...data }, title, url)
  }
}
