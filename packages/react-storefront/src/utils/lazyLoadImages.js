/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
// https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/
export function lazyLoadImages(element) {
  if (!element) return
  const lazyImages = [...element.querySelectorAll('[data-rsf-lazy]')]
  if (!lazyImages.length) return

  let lazyImageObserver

  const load = img => {
    img.src = img.dataset.src
    img.removeAttribute('data-rsf-lazy')

    if (lazyImageObserver) {
      lazyImageObserver.unobserve(img)
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
  } catch (e) {
    // eagerly load images when we don't have the observer
    for (let img of lazyImages) {
      load(img)
    }
  }
}
