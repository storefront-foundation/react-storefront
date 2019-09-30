import React from 'react'
import { Provider } from 'mobx-react'
import createTheme from '../src/createTheme'
import JssProvider from 'react-jss/lib/JssProvider'
import { MuiThemeProvider } from '@material-ui/core/styles'
import Helmet from 'react-helmet'
import { create } from 'jss'
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles'
import jssNested from 'jss-nested'
import { createBrowserHistory } from 'history'
import AppModelBase from '../src/model/AppModelBase'
import GlobalStyles from './GlobalStyles'

const history = createBrowserHistory()
let id = 0

export default function wrapWithProvider(state, themeOverrides) {
  // JSS configuration
  const generateClassName = createGenerateClassName()
  const jss = create(jssPreset(), jssNested())
  const styleNode = document.createComment('jss-insertion-point')
  const nextId = () => id++
  document.head.insertBefore(styleNode, document.head.firstChild)
  jss.options.insertionPoint = 'jss-insertion-point'

  return story => {
    const app = AppModelBase.create({
      location: { pathname: '', search: '' },
      breadcrumbs: [
        { url: '/', text: 'Home' },
        { url: '/tools', text: 'Tool Storage' },
        { text: 'Tool Carts' }
      ],
      cart: {},
      menu: {
        open: true,
        levels: [
          {
            root: true,
            items: [
              { text: 'About', url: '#' },
              {
                text: 'Categories',
                url: '#',
                items: [
                  { text: 'Size', url: '#' },
                  {
                    text: 'Color',
                    url: '#',
                    items: [
                      { text: 'Red', url: '#' },
                      { text: 'Green', url: '#' },
                      { text: 'Blue', url: '#' }
                    ]
                  },
                  { text: 'Age', url: '#' }
                ]
              },
              { text: 'Search', url: '#' }
            ]
          }
        ]
      },
      tabs: {
        items: [
          { text: 'Tab 1', url: '#' },
          { text: 'Tab 2', url: '#' },
          { text: 'Tab 3', url: '#' }
        ]
      },
      searchPopup: { opened: true },
      search: {},
      ...state
    })

    const theme = createTheme(themeOverrides)
    theme.margins = {}

    return (
      <Provider app={app} history={history} router={null} nextId={nextId}>
        <JssProvider jss={jss} generateClassName={generateClassName}>
          <MuiThemeProvider theme={theme}>
            <Helmet>
              <style>{`* { box-sizing: border-box }`}</style>
            </Helmet>
            <GlobalStyles />
            {story()}
          </MuiThemeProvider>
        </JssProvider>
      </Provider>
    )
  }
}
