import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'

@withStyles(theme => ({
  '@global': {
    body: {
      ...theme.typography.body1
    }
  }
}))
export default class GlobalStyles extends Component {
  render() {
    return null
  }
}
