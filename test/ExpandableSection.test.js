import React, { useState } from 'react'
import { mount } from 'enzyme'
import ExpandableSection from 'react-storefront/ExpandableSection'
import { Accordion, AccordionSummary, Typography } from '@material-ui/core'
import { ArrowBack as TestIcon, ExpandMore as ExpandMoreIcon } from '@material-ui/icons'

describe('ExpandableSection', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render children', () => {
    const child = 'child'

    wrapper = mount(
      <ExpandableSection>
        <div id={child}>{child}</div>
      </ExpandableSection>,
    )

    expect(wrapper.find(`#${child}`).text()).toBe(child)
  })

  it('should render with specified title as text', () => {
    wrapper = mount(<ExpandableSection title="test" />)

    expect(
      wrapper
        .find(Typography)
        .filterWhere(n => n.text() === 'test')
        .exists(),
    ).toBe(true)
  })

  it('should render with specified title as react element', () => {
    const titleTest = 'titleTest'
    wrapper = mount(<ExpandableSection title={<div id="titleTest">{titleTest}</div>} />)

    expect(wrapper.find('#titleTest').text()).toBe(titleTest)
  })

  it('should render with specified caption as text', () => {
    wrapper = mount(<ExpandableSection caption="test" />)

    expect(
      wrapper
        .find(Typography)
        .filterWhere(n => n.text() === 'test')
        .exists(),
    ).toBe(true)
  })

  it('should render with specified caption as react element', () => {
    const captionTest = 'captionTest'
    wrapper = mount(<ExpandableSection title={<div id="captionTest">{captionTest}</div>} />)

    expect(wrapper.find('#captionTest').text()).toBe(captionTest)
  })

  it('should allow custom ExpandIcon', () => {
    wrapper = mount(<ExpandableSection ExpandIcon={TestIcon} />)

    expect(wrapper.find(TestIcon).exists()).toBe(true)
  })

  it('should allow custom CollapseIcon', () => {
    wrapper = mount(<ExpandableSection expanded CollapseIcon={TestIcon} />)

    expect(wrapper.find(TestIcon).exists()).toBe(true)
  })

  it('should set specific styles on margin prop', () => {
    wrapper = mount(<ExpandableSection margins={false} />)
    expect(wrapper.find(Accordion).prop('classes').root).not.toContain('margins')

    wrapper = mount(<ExpandableSection margins={true} />)
    expect(wrapper.find(Accordion).prop('classes').root).toContain('margins')
  })

  it('should set fixed expanded state when expanded prop provided', () => {
    wrapper = mount(<ExpandableSection expanded CollapseIcon={TestIcon} />)

    expect(wrapper.find(TestIcon).exists()).toBe(true)
    expect(
      wrapper
        .find(Accordion)
        .childAt(0)
        .prop('expanded'),
    ).toBe(true)
    wrapper.find(AccordionSummary).simulate('click')
    expect(
      wrapper
        .find(Accordion)
        .childAt(0)
        .prop('expanded'),
    ).toBe(true)
  })

  it('should manage expanded state internally', () => {
    wrapper = mount(<ExpandableSection />)

    expect(
      wrapper
        .find(Accordion)
        .childAt(0)
        .prop('expanded'),
    ).toBe(false)
    wrapper.find(AccordionSummary).simulate('click')
    expect(
      wrapper
        .find(Accordion)
        .childAt(0)
        .prop('expanded'),
    ).toBe(true)
  })

  it('should trigger provided onChange function', () => {
    const Test = () => {
      const [expanded, setExpanded] = useState(true)

      const handleChange = (e, expanded) => {
        e.preventDefault()
        setExpanded(expanded)
      }

      return (
        <ExpandableSection onChange={handleChange} expanded={expanded} CollapseIcon={TestIcon} />
      )
    }

    wrapper = mount(<Test />)

    expect(wrapper.find(ExpandMoreIcon).exists()).toBe(false)
    expect(wrapper.find(TestIcon).exists()).toBe(true)
    expect(
      wrapper
        .find(Accordion)
        .childAt(0)
        .prop('expanded'),
    ).toBe(true)

    wrapper.find(AccordionSummary).simulate('click')

    expect(wrapper.find(ExpandMoreIcon).exists()).toBe(true)
    expect(wrapper.find(TestIcon).exists()).toBe(false)
    expect(
      wrapper
        .find(Accordion)
        .childAt(0)
        .prop('expanded'),
    ).toBe(false)
  })

  it('should not change expanded state when onChange prevents default', () => {
    const Test = () => {
      const handleChange = (e, expanded) => {
        e.preventDefault()
      }

      return <ExpandableSection onChange={handleChange} />
    }

    wrapper = mount(<Test />)

    expect(
      wrapper
        .find(Accordion)
        .childAt(0)
        .prop('expanded'),
    ).toBe(false)

    wrapper
      .find(Accordion)
      .childAt(0)
      .simulate('click')

    expect(
      wrapper
        .find(Accordion)
        .childAt(0)
        .prop('expanded'),
    ).toBe(false)
  })

  it('should change expanded state when onChange does not prevent default', () => {
    const Test = () => {
      const handleChange = (e, expanded) => {}

      return <ExpandableSection onChange={handleChange} />
    }

    wrapper = mount(<Test />)

    expect(
      wrapper
        .find(Accordion)
        .childAt(0)
        .prop('expanded'),
    ).toBe(false)

    wrapper.find(AccordionSummary).simulate('click')

    expect(
      wrapper
        .find(Accordion)
        .childAt(0)
        .prop('expanded'),
    ).toBe(true)
  })
})
