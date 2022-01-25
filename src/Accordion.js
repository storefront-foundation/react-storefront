import PropTypes from 'prop-types'
import React, { useState } from 'react'

/**
 * Accordion which only allows one child `ExpandableSection` to be open at a time
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
export default function Accordion({ children }) {
  const [expanded, setExpanded] = useState(
    () => children && children.findIndex(child => child.props.expanded),
  )
  if (!children) {
    return null
  }

  return (
    // wrapped in a Fragment so react-docgen recognizes this as a Component:
    <>
      {React.Children.map(children, (child, i) => {
        return React.cloneElement(child, {
          expanded: expanded === i,
          onChange: (e, expanded) => {
            e.preventDefault()
            setExpanded(expanded ? i : null)
          },
        })
      })}
    </>
  )
}

Accordion.propTypes = {
  /**
   * A list of `ExpandableSection`s that will be controlled.
   */
  children: PropTypes.node,
}
