/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import AmpModal from '../../src/amp/AmpModal'
import { Provider } from 'mobx-react'
import TestProvider from '../TestProvider'
import { mount } from 'enzyme'

describe('AmpModal', () => {
  it('should render', () => {
    expect(
      mount(
        <TestProvider>
          <Provider amp={true}>
            <AmpModal id="my-modal">
              <div>inner</div>
            </AmpModal>
          </Provider>
        </TestProvider>,
      ),
    ).toMatchSnapshot()
  })

  it('should render with custom props', () => {
    expect(
      mount(
        <TestProvider>
          <Provider amp={true}>
            <AmpModal
              id="my-modal"
              animateIn="fly-in-bottom"
              on={`amp-modal-custom-id:AMP.setState({ someStateId: { modalOpened: true }})`}
            >
              <div>inner</div>
            </AmpModal>
          </Provider>
        </TestProvider>,
      ),
    ).toMatchSnapshot()
  })
})
