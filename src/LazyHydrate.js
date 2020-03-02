import React from 'react'
import LazyHydrate from 'react-lazy-hydration'

import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles'
import { SheetsRegistry } from 'jss'

const sheetsManager = new Map()
const sheetsRegistry = new SheetsRegistry()
const generateClassName = createGenerateClassName()

export function getLazyStyleElement(props) {
  return React.createElement(
    'style',
    Object.assign(
      {
        id: 'jss-lazy',
        key: 'jss-lazy',
        dangerouslySetInnerHTML: { __html: sheetsRegistry.toString() },
      },
      props,
    ),
  )
}

function LazyStylesProvider({ children }) {
  return (
    <StylesProvider
      sheetsManager={sheetsManager}
      serverGenerateClassName={generateClassName}
      sheetsRegistry={sheetsRegistry}
    >
      {children}
    </StylesProvider>
  )
}

export default function({ children, ...props }) {
  return (
    <LazyHydrate {...props}>
      <LazyStylesProvider>{children}</LazyStylesProvider>
    </LazyHydrate>
  )
}
