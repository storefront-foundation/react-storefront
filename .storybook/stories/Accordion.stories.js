import React from 'react'
import ExpandableSection from '../../src/ExpandableSection'
import Accordion from '../../src/Accordion'

export default { title: 'Accordion' }

export const defaults = () => (
  <Accordion>
    <ExpandableSection title="First">
      <div>The first section</div>
    </ExpandableSection>
    <ExpandableSection title="Second">
      <div>The second section</div>
    </ExpandableSection>
    <ExpandableSection title="Third">
      <div>The third section</div>
    </ExpandableSection>
  </Accordion>
)
