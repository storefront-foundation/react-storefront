/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import withAmp from "../../src/amp/withAmp"
import { mount } from 'enzyme'
import { Provider } from "mobx-react";
import { createMemoryHistory } from 'history'

describe('withAmp', () => {

  it('should add the link rel="amphtml" to the document head', () => {
    const Test = withAmp(() => <div/>)
    const history = createMemoryHistory({ initialEntries: ['/foo?bar=1']})
    const wrapper = mount(<Provider app={{ amp: false, location: { hostname: 'localhost', pathname: '/', search: '' } }} history={history}><Test/></Provider>)
    expect(wrapper).toMatchSnapshot()
  })

})