/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import Enzyme from 'enzyme'
import EnzymeAdapter from 'enzyme-adapter-react-16'
import fetchMock from 'jest-fetch-mock'
import mockGetStats from './mock-pwa-stats'

// Setup enzyme's react adapter
Enzyme.configure({ adapter: new EnzymeAdapter() })

global.requestAnimationFrame = function(callback) {
  setTimeout(callback, 0)
}

global.jsdom.reconfigure({
  features: {
    ProcessExternalResources: false
  }
})

global.fetch = fetchMock

jest.mock('fetch', () => global.fetch, { virtual: true })
jest.mock('react-storefront-stats', () => mockGetStats, { virtual: true })
