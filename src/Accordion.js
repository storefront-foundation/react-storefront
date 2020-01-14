import React, { createContext, useState } from 'react'

export const AccordionContext = createContext()

/**
 * Accordion which only allows one child ExpandableSection to be open at a time
 *
 * ```js
 *  <Accordion>
 *    <ExpandableSection title="First">
 *      <div>The first section</div>
 *    </ExpandableSection>
 *    <ExpandableSection title="Second">
 *      <div>The second section</div>
 *    </ExpandableSection>
 *    <ExpandableSection title="Third">
 *      <div>The third section</div>
 *    </ExpandableSection>
 *  </Accordion>
 * ```
 */
export default function Accordion({ children, ...otherProps }) {
  if (!children) {
    return null
  }

  const [expanded, setExpanded] = useState(() => children.findIndex(child => child.props.expanded))

  return React.Children.map(children, (child, i) => {
    return React.cloneElement(child, {
      expanded: expanded === i,
      onChange: (e, expanded) => {
        e.preventDefault()
        setExpanded(expanded ? i : null)
      },
    })
  })
}
