import React from 'react'

import { withKnobs, boolean } from '@storybook/addon-knobs'
import TabPanel from '../../src/TabPanel'

export default { title: 'TabPanel', decorators: [withKnobs] }

export const defaults = () => (
  <TabPanel scrollable={boolean('Scrollable', true)}>
    <div label="First Tab">Contents of the first tab</div>
    <div label="Second Tab">Contents of the second tab</div>
    <div label="Third Tab">Contents of the third tab</div>
    <div label="Fourth Tab">Contents of the fourth tab</div>
    <div label="Fifth Tab">Contents of the fifth tab</div>
  </TabPanel>
)
