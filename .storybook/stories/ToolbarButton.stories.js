import React from 'react'
import { Pets } from '@material-ui/icons'
import ToolbarButton from '../../src/ToolbarButton'

export default { title: 'ToolbarButton' }

export const defaults = () => <ToolbarButton icon={<Pets />} label="Label" />
