import React from 'react'
import { Pets } from '@mui/icons-material'
import ToolbarButton from '../../src/ToolbarButton'

export default { title: 'ToolbarButton' }

export const defaults = () => <ToolbarButton icon={<Pets />} label="Label" />
