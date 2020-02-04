import React from 'react'
import { Pets } from '@material-ui/icons'
import Offline from '../../src/Offline'

export default { title: 'Offline' }

export const defaults = () => <Offline />
export const customHeading = () => <Offline heading="This is a heading" />
export const customMessage = () => <Offline message="This is a message" />
export const customIcon = () => <Offline Icon={Pets} />
