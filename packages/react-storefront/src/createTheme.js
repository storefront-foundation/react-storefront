/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { createMuiTheme } from '@material-ui/core/styles'
import merge from 'lodash/merge'

export default function createTheme(values = {}) {
  let config = {}

  merge(
    config,
    {
      typography: {
        useNextVariants: true,
      },

      palette: {
        // primary
        // secondary
      },

      margins: {
        // vertical margin on Container component
        container: 15,

        // horizontal margin on Row component
        row: 15,
      },

      zIndex: {
        amp: {
          // the z-index for modals in amp
          modal: 2147483646,
        },
      },

      // The height of the app header
      headerHeight: 64,

      // Override the icon for all expanders in collapsed state - this should be a React component class, for example @material-ui/icons/Add
      ExpandIcon: null,

      // Override the icon for all expanders in expanded state - this should be a React component classm for example @material-ui/icons/Remove
      CollapseIcon: null,
    },
    values,
  )

  const theme = createMuiTheme(config)

  if (!theme.maxWidth) {
    theme.maxWidth = `${theme.breakpoints.values.lg}px`
  }

  return theme
}
