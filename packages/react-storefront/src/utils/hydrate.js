/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import JssProvider from 'react-jss/lib/JssProvider'
import { create } from 'jss'
import { jssPreset } from '@material-ui/core/styles'
import jssNested from 'jss-nested'
import { MuiThemeProvider } from '@material-ui/core/styles'
import createGenerateClassName from './createGenerateClassName'

/**
 * Removes the style tag rendered on the server so that components are styled correctly
 * after hydration.
 * @private
 */
function removeSSRStyles() {
  const jssStyles = document.getElementById('ssr-css')

  if (jssStyles && jssStyles.parentNode) {
    jssStyles.parentNode.removeChild(jssStyles)
  }
}

/**
 * Hydrates React component
 * @private
 * @param  {options} options
 * @param  {React.Component} options.component    Component to be rendered
 * @param  {Model} options.model                  MobX Model
 * @param  {Object} options.theme                 MUI Theme
 * @param  {String} options.target                Selector for rendering target
 * @param  {String} options.providerProps         Props to add the to <Provider/> element
 * @param  {String} options.initialStateProperty  Optional window property name for initial state
 * @return {Object} The app state
 */
export default function hydrate({
  component,
  model,
  theme,
  target,
  providerProps = {},
  initialStateProperty = 'initialState',
  cssPrefix = 'jss'
}) {
  const generateClassName = createGenerateClassName()
  const state = model.create(window[initialStateProperty] || {})
  const jss = create(jssPreset(), jssNested())
  window.moov = window.moov || {}
  Object.assign(window.moov, { state, timing: {} }, providerProps)
  // skip jss insertion if we are hydrating SSR cached by the service worker because it has already been mounted
  if (!document.body.hasAttribute('data-jss-inserted')) {
    const styleNode = document.createComment('jss-insertion-point')
    document.head.insertBefore(styleNode, document.head.firstChild)
    jss.options.insertionPoint = 'jss-insertion-point'
    document.body.setAttribute('data-jss-inserted', 'on')
  }
  ReactDOM.hydrate(
    <Provider app={state} {...providerProps}>
      <JssProvider classNamePrefix={cssPrefix} jss={jss} generateClassName={generateClassName}>
        <MuiThemeProvider theme={theme}>{component}</MuiThemeProvider>
      </JssProvider>
    </Provider>,
    target,
    removeSSRStyles
  )
  return state
}
