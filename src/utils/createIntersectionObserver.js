export default function createIntersectionObserver(el, callback) {
  if (!window.IntersectionObserver) throw new Error('IntersectionObserver is not available')
  const observer = new IntersectionObserver(entries => {
    // if intersectionRatio is 0, the element is out of view and we do not need to do anything.
    callback(entries[0].intersectionRatio > 0, () => observer.disconnect())
  })
  if (el) {
    observer.observe(el)
  }
  return observer
}
