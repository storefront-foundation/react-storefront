import React from 'react'
import { Pets } from '@material-ui/icons'
import BackToTop from '../../src/BackToTop'

export default { title: 'BackToTop' }

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

export const medium = () => (
  <div>
    <div style={styles}>Please scroll down</div>
    <BackToTop />
  </div>
)

export const small = () => (
  <div>
    <div style={styles}>Please scroll down</div>
    <BackToTop size="small" />
  </div>
)

export const large = () => (
  <div>
    <div style={styles}>Please scroll down</div>
    <BackToTop size="large" />
  </div>
)

export const customIcon = () => (
  <div>
    <div style={styles}>Please scroll down</div>
    <BackToTop Icon={Pets} />
  </div>
)
