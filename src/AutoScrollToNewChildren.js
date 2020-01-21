import React, { useEffect, useState, useRef } from 'react'

/**
 * A wrapper component which scrolls the first new child into view when
 * the number of children increases.
 */
const AutoScrollToNewChildren = ({ children }) => {
  const childCount = React.Children.count(children)
  const [priorChildCount, setPriorChildCount] = useState(childCount)
  const firstNewChild = useRef(null)

  useEffect(() => {
    if (!priorChildCount) {
      setPriorChildCount(childCount)
    } else if (childCount > priorChildCount) {
      firstNewChild.current.scrollIntoView({ behavior: 'smooth' })
      setPriorChildCount(childCount)
    }
  }, [childCount, setPriorChildCount, priorChildCount])

  return (
    // wrapped in a Fragment so react-docgen recognizes this as a Component:
    <>
      {React.Children.map(children, (child, index) => {
        return (
          <>
            {child}
            {index === priorChildCount ? <div ref={firstNewChild} /> : null}
          </>
        )
      })}
    </>
  )
}

export default AutoScrollToNewChildren
