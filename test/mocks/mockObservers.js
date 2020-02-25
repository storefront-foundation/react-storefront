export class Observer {
  disconnected = false

  constructor(callback) {
    IntersectionObserver.instance = this
    ResizeObserver.instance = this
    this.callback = callback
  }

  simulateChange(intersectionRatio, target) {
    this.callback([{ intersectionRatio, isIntersecting: intersectionRatio > 0, target }])
  }

  observe(r) {
    this.ref = r
  }

  unobserve(r) {
    this.ref = undefined
  }

  disconnect() {
    this.disconnected = true
  }
}

export function resetObservers() {
  delete IntersectionObserver.instance
  delete ResizeObserver.instance
  delete IntersectionObserver.ref
  delete ResizeObserver.ref
}
