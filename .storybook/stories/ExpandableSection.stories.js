import React from 'react'
import { withKnobs, text, boolean } from '@storybook/addon-knobs'
import ExpandableSection from '../../src/ExpandableSection'
import { Typography } from '@material-ui/core'

export default { title: 'ExpandableSection', decorators: [withKnobs] }

export const options = () => (
  <ExpandableSection
    title={text('Title', 'Help')}
    caption={text('Caption', 'Click here for more info')}
    expanded={boolean('Expanded', true)}
  >
    <Typography>{text('Content', 'This is a help section')}</Typography>
  </ExpandableSection>
)
