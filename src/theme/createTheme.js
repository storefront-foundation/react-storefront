import { createTheme, adaptV4Theme } from '@mui/material/styles'
// import { createTheme } from '@mui/material/styles';
import merge from 'lodash/merge'

/**
 * Creates the default theme for your React Storefront app.  See Material UI's theme documentation
 * for more info: https://mui.com/customization/default-theme/
 * @param {Object} values
 * @return {Object} A material UI theme
 */

export default function createThemeFunc(values = {}) {
  const theme = createTheme(
    merge(
      {},
      {
        zIndex: {
          modal: 999,
          amp: {
            modal: 2147483646,
          },
        },
        headerHeight: 64,
        loadMaskOffsetTop: 64 + 56 + 4,
        drawerWidth: 330,
        components: {},
      },
      values,
    ),
  )

  if (!theme.maxWidth) {
    theme.maxWidth = `${theme.breakpoints.values.lg}px`
  }

  return theme
}
