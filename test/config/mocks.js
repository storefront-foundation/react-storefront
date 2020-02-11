import { Observer, resetObservers } from '../mocks/mockObservers'
import fetchMock from 'jest-fetch-mock'
global.fetch = global.fetchMock = fetchMock
global.IntersectionObserver = Observer
global.ResizeObserver = Observer
global.HTMLElement.prototype.scrollIntoView = () => {}

jest.doMock('isomorphic-unfetch', () => fetchMock)
jest.doMock('next/router', () => require('../mocks/mockRouter'))
jest.doMock('next/link', () => require('../mocks/mockNextLink'))

global.beforeEach(() => {
  resetObservers()
})
