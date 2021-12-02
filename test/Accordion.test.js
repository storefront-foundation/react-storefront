import React from 'react'
import { mount } from 'enzyme'
import Accordion from 'react-storefront/Accordion'
import ExpandableSection from 'react-storefront/ExpandableSection'
import {
  AccordionSummary as ExpansionPanelSummary,
  Accordion as ExpansionPanel,
} from '@mui/material'

describe('Accordion', () => {
  it('should be empty render without children', () => {
    const wrapper = mount(<Accordion />)

    expect(wrapper.find(Accordion).isEmptyRender()).toBe(true)
    wrapper.unmount()
  })

  describe('should allow only one section to be expanded at a time', () => {
    let wrapper

    afterAll(() => wrapper.unmount())

    wrapper = mount(
      <Accordion>
        <ExpandableSection id="first" title="First">
          <div>The first section</div>
        </ExpandableSection>
        <ExpandableSection id="second" title="Second">
          <div>The second section</div>
        </ExpandableSection>
        <ExpandableSection id="third" title="Third">
          <div>The third section</div>
        </ExpandableSection>
      </Accordion>,
    )

    it('should have 3 sections', () => {
      expect(wrapper.find(ExpansionPanelSummary).length).toBe(3)
    })

    it('should have 0 expanded sections', () => {
      expect(
        wrapper.find(ExpansionPanelSummary).filterWhere(panel => panel.prop('expanded') === true)
          .length,
      ).toBe(0)
    })

    it('should expand section on section click ', () => {
      wrapper
        .find(ExpansionPanelSummary)
        .last()
        .simulate('click')

      expect(
        wrapper
          .find(ExpansionPanel)
          .last()
          .prop('expanded'),
      ).toBe(true)
    })

    it('should verify that previous opened section is closed on new section click', () => {
      wrapper
        .find(ExpansionPanelSummary)
        .first()
        .simulate('click')

      expect(
        wrapper
          .find(ExpansionPanel)
          .first()
          .prop('expanded'),
      ).toBe(true)

      wrapper
        .find(ExpansionPanelSummary)
        .last()
        .simulate('click')

      expect(
        wrapper
          .find(ExpansionPanel)
          .first()
          .prop('expanded'),
      ).toBe(false)

      expect(
        wrapper
          .find(ExpansionPanel)
          .last()
          .prop('expanded'),
      ).toBe(true)

      expect(
        wrapper.find(ExpansionPanel).filterWhere(panel => panel.prop('expanded') === true).length,
      ).toBe(1)
    })

    it('should close the section if clicked again on the same section', () => {
      wrapper
        .find(ExpansionPanelSummary)
        .first()
        .simulate('click')
      expect(
        wrapper
          .find(ExpansionPanel)
          .first()
          .prop('expanded'),
      ).toBe(true)

      wrapper
        .find(ExpansionPanelSummary)
        .first()
        .simulate('click')
      expect(
        wrapper
          .find(ExpansionPanel)
          .first()
          .prop('expanded'),
      ).toBe(false)

      expect(
        wrapper.find(ExpansionPanel).filterWhere(panel => panel.prop('expanded') === true).length,
      ).toBe(0)
    })
  })
})
