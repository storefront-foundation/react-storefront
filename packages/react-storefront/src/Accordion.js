/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { useState, useContext } from 'react'
import AppContext from './AppContext'
import AmpAccordion from './amp/AmpAccordion'

const AccordionContext = React.createContext()

export const withAccordionContext = Component => {
  return props => (
    <AccordionContext.Consumer>
      {ctx => <Component {...props} {...ctx} />}
    </AccordionContext.Consumer>
  )
}

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
  const [expandedSectionId, setExpandedSectionId] = useState(null)
  const {
    app: { amp }
  } = useContext(AppContext)
  return (
    <AccordionContext.Provider
      value={{
        expandedSectionId,
        setExpandedSectionId
      }}
    >
      {amp ? <AmpAccordion {...otherProps}>{children}</AmpAccordion> : children}
    </AccordionContext.Provider>
  )
}
