import React, { Fragment, useEffect, useState, useRef } from 'react'

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

  return React.Children.map(children, (child, index) => {
    return (
      <Fragment>
        {child}
        {index === priorChildCount ? <div ref={firstNewChild} /> : null}
      </Fragment>
    )
  })
}

export default AutoScrollToNewChildren
