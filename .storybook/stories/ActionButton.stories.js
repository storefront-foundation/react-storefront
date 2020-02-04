import React from 'react'
import ActionButton from '../../src/ActionButton'

export default { title: 'ActionButton' }

export const withLabel = () => <ActionButton label="Sort" />
export const withValue = () => <ActionButton value="Lowest Price" />
export const withBoth = () => <ActionButton label="Sort" value="Lowest Price" />
