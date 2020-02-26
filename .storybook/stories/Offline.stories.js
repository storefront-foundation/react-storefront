import React from 'react'
import { Pets } from '@material-ui/icons'
import { withKnobs, text } from '@storybook/addon-knobs'
import Offline from '../../src/Offline'

export default { title: 'Offline', decorators: [withKnobs] }

export const options = () => (
  <Offline
    heading={text('Heading', 'This is a heading')}
    message={text('Message', 'This is a message')}
  />
)
export const customIcon = () => <Offline Icon={Pets} />
