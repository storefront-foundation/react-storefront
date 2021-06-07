import React from 'react'
import { mount } from 'enzyme'
import Accordion from 'react-storefront/Accordion'
import ExpandableSection from 'react-storefront/ExpandableSection'
import { AccordionSummary, Accordion as MUIAccordion } from '@material-ui/core'

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
      expect(wrapper.find(AccordionSummary).length).toBe(3)
    })

    it('should have 0 expanded sections', () => {
      expect(
        wrapper.find(AccordionSummary).filterWhere(panel => panel.prop('expanded') === true).length,
      ).toBe(0)
    })

    it('should expand section on section click ', () => {
      wrapper
        .find(AccordionSummary)
        .last()
        .simulate('click')

      expect(
        wrapper
          .find(MUIAccordion)
          .last()
          .prop('expanded'),
      ).toBe(true)
    })

    it('should verify that previous opened section is closed on new section click', () => {
      wrapper
        .find(AccordionSummary)
        .first()
        .simulate('click')

      expect(
        wrapper
          .find(MUIAccordion)
          .first()
          .prop('expanded'),
      ).toBe(true)

      wrapper
        .find(AccordionSummary)
        .last()
        .simulate('click')

      expect(
        wrapper
          .find(MUIAccordion)
          .first()
          .prop('expanded'),
      ).toBe(false)

      expect(
        wrapper
          .find(MUIAccordion)
          .last()
          .prop('expanded'),
      ).toBe(true)

      expect(
        wrapper.find(MUIAccordion).filterWhere(panel => panel.prop('expanded') === true).length,
      ).toBe(1)
    })

    it('should close the section if clicked again on the same section', () => {
      wrapper
        .find(AccordionSummary)
        .first()
        .simulate('click')
      expect(
        wrapper
          .find(MUIAccordion)
          .first()
          .prop('expanded'),
      ).toBe(true)

      wrapper
        .find(AccordionSummary)
        .first()
        .simulate('click')
      expect(
        wrapper
          .find(MUIAccordion)
          .first()
          .prop('expanded'),
      ).toBe(false)

      expect(
        wrapper.find(MUIAccordion).filterWhere(panel => panel.prop('expanded') === true).length,
      ).toBe(0)
    })
  })
})
