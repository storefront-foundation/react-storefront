import React from 'react'
import { storiesOf } from '@storybook/react'
import wrapWithProvider from './wrapWithProvider'
import NavTabs from '../src/NavTabs'

storiesOf('NavTabs', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with default props', () => <NavTabs />)
