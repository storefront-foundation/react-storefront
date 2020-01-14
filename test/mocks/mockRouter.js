import { EventEmitter } from 'events'

const events = new EventEmitter()

let beforePopState = Function.prototype

const routerMocks = {
  events: {
    on: (event, cb) => events.on(event, cb),
    off: (event, cb) => events.removeListener(event, cb),
  },
  beforePopState(cb) {
    beforePopState = cb
  },
  push: jest.fn((url, as, options) => ({
    url,
    as,
    options,
  })),
  asPath: '',
  query: {},
}

export const useRouter = jest.fn(() => routerMocks)

export default routerMocks

export function navigate(url) {
  events.emit('beforeHistoryChange')
  window.history.pushState(null, null, url)
  events.emit('routeChangeComplete')
}

export function goBack() {
  if (beforePopState() !== false) {
    window.history.back()
  }
}
