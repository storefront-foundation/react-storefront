/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import { InputAdornment, TextField, withStyles } from '@material-ui/core'
import Search from '@material-ui/icons/Search'

export const styles = theme => ({
  input: {
    paddingTop: '10px',
    paddingBottom: '10px'
  }
})

@withStyles(styles, { name: 'RSFSearchField' })
export default class SearchField extends Component {

  render() {
    const { classes, ...others } = this.props

    return (
      <TextField 
        variant="outlined" 
        type="search" 
        placeholder="Search"
        InputProps={{
          startAdornment: <InputAdornment position="start"><Search/></InputAdornment>,
          margin: 'dense',
          classes
        }}
        {...others}
      />
    )
  }

}
