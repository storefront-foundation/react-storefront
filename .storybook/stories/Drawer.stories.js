import React from 'react'

import { withKnobs, text, boolean, select } from '@storybook/addon-knobs'
import Drawer from '../../src/drawer/Drawer'

export default { title: 'Drawer', decorators: [withKnobs] }

export const defaults = () => (
  <>
    <div>Use the knobs to open the drawer.</div>
    <div>Knobs can be adjusted when the drawer is closed.</div>
    <Drawer
      open={boolean('Open', false)}
      fullscreen={boolean('Fullscreen', true)}
      anchor={select(
        'Anchor',
        { Top: 'top', Bottom: 'bottom', Left: 'left', Right: 'right' },
        'bottom',
      )}
      title={text('Title', 'Example Drawer')}
      showCloseButton={boolean('Close Button', true)}
    >
      <div
        style={{
          height: 200,
          margin: 50,
          backgroundColor: 'silver',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        These are the drawer contents
      </div>
    </Drawer>
  </>
)
