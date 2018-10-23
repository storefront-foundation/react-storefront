import React from 'react';
import TabsRow from '../src/TabsRow'
import { mount } from 'enzyme'
import TestProvider from './TestProvider'

describe('TabsRow', () => {
  describe('render', () => {
    it('should render tabs with images', () => {
      expect(mount(
        <TestProvider>
          <TabsRow
            items={[
              { imageUrl: 'https://example.com' },
              { imageUrl: 'https://example.com' }
            ]}
          />          
        </TestProvider>
      )).toMatchSnapshot()
    })
    it('should render tabs with text', () => {
      expect(mount(
        <TestProvider>
          <TabsRow
            items={[
              { text: 'Tab 1' },
              { text: 'Tab 2' }
            ]}
          />          
        </TestProvider>
      )).toMatchSnapshot()
    })
    it('should render tabs with urls', () => {
      expect(mount(
        <TestProvider>
          <TabsRow
            items={[
              { text: 'Tab 1', url: 'https://www.example.com' },
              { text: 'Tab 2', url: 'https://www.example.com' }
            ]}
          />          
        </TestProvider>
      )).toMatchSnapshot()
    })
    it('should render in amp', () => {
      expect(mount(
        <TestProvider app={{ amp: true }}>
          <TabsRow
            items={[
              { text: 'Tab 1', url: 'https://www.example.com' },
              { text: 'Tab 2', url: 'https://www.example.com' }
            ]}
          />          
        </TestProvider>
      )).toMatchSnapshot()
    })
  })
})