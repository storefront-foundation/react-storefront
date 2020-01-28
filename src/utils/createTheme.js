import { createMuiTheme } from '@material-ui/core/styles'
import merge from 'lodash/merge'

export default function createTheme(values = {}) {
  let config = {}

  merge(
    config,
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
      overrides: {},
    },
    values,
  )

  const theme = createMuiTheme(config)

  if (!theme.maxWidth) {
    theme.maxWidth = `${theme.breakpoints.values.lg}px`
  }

  return theme
}
