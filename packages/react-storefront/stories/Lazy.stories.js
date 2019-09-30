import React from 'react'
import { storiesOf } from '@storybook/react'
import wrapWithProvider from './wrapWithProvider'
import Lazy from '../src/Lazy'

storiesOf('Lazy', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with defaults', () => (
    <div>
      <div style={{ height: '2000px' }}>Scroll Down</div>
      <Lazy>
        <div style={{ width: '100%', height: 500, background: '#abccba' }}>Hello World!</div>
      </Lazy>
    </div>
  ))
  .addWithJSX('with set height', () => (
    <div>
      <h1>Header</h1>
      <Lazy style={{ height: 500 }}>
        <img src="https://placehold.it/200x500" alt="placeholder" />
      </Lazy>
      <p>This text should not move</p>
    </div>
  ))
