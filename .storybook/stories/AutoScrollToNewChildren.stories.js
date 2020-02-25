import React, { useState } from 'react'
import AutoScrollToNewChildren from '../../src/AutoScrollToNewChildren'

export default { title: 'AutoScrollToNewChildren' }

const styles = {
  background: '#7f8fa6',
  color: '#f5f6fa',
  fontSize: 30,
  fontFamily: 'monospace',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 700,
  marginBottom: 5,
}

export const defaults = () => {
  const [count, setCount] = useState(1)
  return (
    <AutoScrollToNewChildren>
      {Array(count)
        .fill(0)
        .map((e, i) => (
          <div onClick={() => setCount(count + 1)} style={styles}>
            Click Me ({i})
          </div>
        ))}
    </AutoScrollToNewChildren>
  )
}
