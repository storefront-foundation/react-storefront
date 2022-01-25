/**
 * Observes the visibility of all `img` elements inside the specified element
 * that match the specified selector. When an image becomes visible, the `data-src`
 * attribute is copied to `src`.
 *
 * See https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/
 * @param {DOMElement} element The img element to lazy load
 * @param {Object} options
 * @param {Object} options.lazySrcAttribute The attribute containing the image URL. Defaults to `data-src`.
 */
export default function lazyLoadImages(element, { lazySrcAttribute = 'data-src' } = {}) {
  if (!element) return
  const lazyImages = [...element.querySelectorAll(`img[${lazySrcAttribute}]`)]
  if (!lazyImages.length) return

  let lazyImageObserver

  const load = img => {
    const src = img.getAttribute(lazySrcAttribute)
    const onload = () => {
      img.removeAttribute(lazySrcAttribute)
      img.removeEventListener('load', onload)
    }
    img.addEventListener('load', onload)
    img.setAttribute('src', src)
  }

  const observerHandler = function(entries, self) {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        load(entry.target)
        // the image is now in place, stop watching
        if (self) {
          self.unobserve(entry.target)
        }
      }
    }
  }

  try {
    lazyImageObserver = new window.IntersectionObserver(observerHandler)

    for (const img of lazyImages) {
      lazyImageObserver.observe(img)
    }

    return lazyImageObserver
  } catch (e) {
    // eagerly load images when we don't have the observer
    for (const img of lazyImages) {
      load(img)
    }
  }
}
