import React from 'react'
import { Pets } from '@mui/icons-material'
import { withKnobs, select } from '@storybook/addon-knobs'
import BackToTop from '../../src/BackToTop'

export default { title: 'BackToTop', decorators: [withKnobs] }

const styles = {
  background: '#7f8fa6',
  color: '#f5f6fa',
  fontSize: 30,
  fontFamily: 'monospace',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 1500,
}

export const sizes = () => (
  <div>
    <div style={styles}>Please scroll down</div>
    <BackToTop
      size={select('Size', { small: 'small', medium: 'medium', large: 'large' }, 'medium')}
    />
  </div>
)

export const customIcon = () => (
  <div>
    <div style={styles}>Please scroll down</div>
    <BackToTop Icon={Pets} />
  </div>
)
