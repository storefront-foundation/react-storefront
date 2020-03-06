import React from 'react'

import { withKnobs, boolean, select } from '@storybook/addon-knobs'
import LoadMask from '../../src/LoadMask'

export default { title: 'LoadMask', decorators: [withKnobs] }

export const defaults = () => (
  <div>
    <LoadMask
      show={boolean('Show', true)}
      transparent={boolean('Transparent', true)}
      align={select('Align', { Center: 'center', Top: 'top' }, 'center')}
    />
    <div style={{ padding: 30 }}>This content is being masked.</div>
    <div style={{ padding: 30, backgroundColor: 'steelblue', color: 'white' }}>
      This content is also being masked.
    </div>
  </div>
)
