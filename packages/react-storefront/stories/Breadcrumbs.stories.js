import React from 'react'
import { storiesOf } from '@storybook/react'
import wrapWithProvider from './wrapWithProvider'
import Breadcrumbs from '../src/Breadcrumbs'
import { BreadcrumbModel } from '../src/model/AppModelBase'

storiesOf('Breadcrumbs', module)
  .addDecorator(wrapWithProvider())
  .addWithJSX('with default props', () => (
    <Breadcrumbs
      items={[
        BreadcrumbModel.create({ url: '#', text: 'Home' }),
        BreadcrumbModel.create({ url: '#', text: 'Tool Storage' }),
        BreadcrumbModel.create({ url: '#', text: 'Tool Carts' })
      ]}
    />
  ))
