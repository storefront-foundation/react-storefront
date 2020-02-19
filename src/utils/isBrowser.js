/**
 * Returns true when running in the browser, otherwise false.
 */
export default function isBrowser() {
  return typeof window !== 'undefined'
}
