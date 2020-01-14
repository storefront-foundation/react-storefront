import React from 'react'
import ExpandableSection from '../../src/ExpandableSection'
import { Typography } from '@material-ui/core'

export default { title: 'ExpandableSection' }

export const collapsed = () => (
  <ExpandableSection title="Help" caption="Click here for more info">
    <Typography>This is a help section</Typography>
  </ExpandableSection>
)

export const expanded = () => (
  <ExpandableSection title="Help" caption="Click here for more info" expanded={true}>
    <Typography>This is a help section</Typography>
  </ExpandableSection>
)
