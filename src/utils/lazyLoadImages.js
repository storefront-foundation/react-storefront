/**
 * Observes the visibility of all img elements inside the specified element
 * that match the specified selector. When an image becomes visible, the `data-src`
 * attribute is copied to `src`.
 *
 * See https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/
 */
export default function lazyLoadImages(element, { selector = 'img[data-rsf-lazy]' } = {}) {
  if (!element) return
  const lazyImages = [...element.querySelectorAll(selector)]
  if (!lazyImages.length) return

  let lazyImageObserver

  const load = img => {
    img.src = img.dataset.src

    if (lazyImageObserver) {
      lazyImageObserver.disconnect(img)
    }
  }

  const observerHandler = function(entries) {
    for (let entry of entries) {
      if (entry.isIntersecting) {
        load(entry.target)
      }
    }
  }

  try {
    lazyImageObserver = new window.IntersectionObserver(observerHandler)

    for (let img of lazyImages) {
      lazyImageObserver.observe(img)
    }

    return lazyImageObserver
  } catch (e) {
    // eagerly load images when we don't have the observer
    for (let img of lazyImages) {
      load(img)
    }
  }
}
