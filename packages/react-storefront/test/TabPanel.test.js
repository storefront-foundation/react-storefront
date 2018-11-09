/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import TabPanel from '../src/TabPanel'
import AmpState from '../src/amp/AmpState'
import Provider from './TestProvider'

describe('TabPanel', () => {

  it('should render first panel as selected by default', () => {
    const wrapper = mount(
      <Provider>
        <AmpState>
          <TabPanel>
            <div className="panel-a" label="A">This is A</div>
            <div className="panel-b" label="B">This is B</div>
            <div className="panel-c" label="C">This is C</div>
          </TabPanel>
        </AmpState>
      </Provider>
    );
    expect(wrapper.find('.panel-a').parent().prop('selected')).toBe(true);
  })

  it('should not override state when updating other props', () => {
    const wrapper = mount(
      <Provider>
        <AmpState>
          <TabPanel selected={2}>
            <div className="panel-a" label="A">This is A</div>
            <div className="panel-b" label="B">This is B</div>
            <div className="panel-c" label="C">This is C</div>
          </TabPanel>
        </AmpState>
      </Provider>
    );
    // Reach in and change prop forcefully, since Enzyme will not allow us to use
    // the `setProps` method for a non-root wrapper
    wrapper.find('TabPanel').instance().componentWillReceiveProps({
      scrollable: false
    });
    wrapper.update();
    expect(wrapper.find('.panel-a').parent().prop('selected')).toBe(false);
    expect(wrapper.find('.panel-b').parent().prop('selected')).toBe(false);
    expect(wrapper.find('.panel-c').parent().prop('selected')).toBe(true);
  })

  it('should override state when updating selected prop', () => {
    const wrapper = mount(
      <Provider>
        <AmpState>
          <TabPanel selected={2}>
            <div className="panel-a" label="A">This is A</div>
            <div className="panel-b" label="B">This is B</div>
            <div className="panel-c" label="C">This is C</div>
          </TabPanel>
        </AmpState>
      </Provider>
    );
    // Reach in and change prop forcefully, since Enzyme will not allow us to use
    // the `setProps` method for a non-root wrapper
    wrapper.find('TabPanel').instance().componentWillReceiveProps({
      selected: 1
    });
    wrapper.update();
    expect(wrapper.find('.panel-a').parent().prop('selected')).toBe(false);
    expect(wrapper.find('.panel-b').parent().prop('selected')).toBe(true);
    expect(wrapper.find('.panel-c').parent().prop('selected')).toBe(false);
  })

})