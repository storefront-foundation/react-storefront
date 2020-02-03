import { IntersectionObserver, resetIntersectionObserver } from '../mocks/mockIntersectionObserver'
import fetchMock from 'jest-fetch-mock'
global.fetch = global.fetchMock = fetchMock
global.IntersectionObserver = IntersectionObserver
global.HTMLElement.prototype.scrollIntoView = () => {}

jest.doMock('isomorphic-unfetch', () => fetchMock)
jest.doMock('next/router', () => require('../mocks/mockRouter'))
jest.doMock('next/link', () => require('../mocks/mockNextLink'))

global.beforeEach(() => {
  resetIntersectionObserver()
})
