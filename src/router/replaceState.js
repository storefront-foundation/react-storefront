/**
 * Replaces the history state in a way that is compatible with next.js. Use this function
 * instead of `history.replaceState` to ensure that next.js uses your new state's URL when going back.
 * @param {Object} state A new state.  If `null`, the existing state will be preserved.
 * @param {String} title A new title for the document, if `null`, the existing title will be preserved.
 * @param {String} url The new URL
 */
export default function replaceState(state, title, url) {
  if (state == null) {
    state = history.state
  }

  history.replaceState({ ...state, as: url }, title || document.title, url)
}
