import React from 'react'
import { Pets } from '@mui/icons-material'
import Rating from '../../src/Rating'

export default { title: 'Rating' }

export const defaults = () => <Rating value={3.5} />
export const fillEmpty = () => <Rating value={2} fillEmpty />
export const customIcons = () => <Rating iconFull={Pets} fillEmpty />
