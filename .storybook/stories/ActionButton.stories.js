import React from 'react'
import { withKnobs, text } from '@storybook/addon-knobs'
import ActionButton from '../../src/ActionButton'

export default { title: 'ActionButton', decorators: [withKnobs] }

export const options = () => (
  <ActionButton label={text('Label', 'Sort')} value={text('Value', 'Lowest Price')} />
)
