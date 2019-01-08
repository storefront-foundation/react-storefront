/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import RedboxReact from  'redbox-react'
import uniq from 'lodash/uniq'
import withStyles from '@material-ui/core/styles/withStyles'

export const styles = theme => ({
  amp: {
    fontWeight: 'bold', 
    backgroundColor: 'red', 
    color: 'white', 
    position: 'fixed', 
    top: 0, 
    bottom: 0, 
    left: 0, 
    right: 0, 
    overflow: 'auto', 
    zIndex: theme.zIndex.amp.modal + 10,
    padding: `${theme.margins.container}px`,
    whiteSpace: 'pre-wrap',
    fontWeight: 'bold',
    margin: 0
  }
})

/**
 * A basic error view for use in development.  Since this shows a low-level error message and stack trace, 
 * you should replace this with something more user-friendly in production.
 */
@withStyles(styles, { name: 'RSFRedbox' })
@inject('app')
@observer
export default class Redbox extends Component {

  componentDidMount() {
    // log original error message to the console
    const { error, stack } = this.props.app
    console.error(this.reformat(error))
    console.error(this.createError(error, stack))
  }

  render() {
    // render improved error message
    const { app: { error, stack, amp }, classes } = this.props

    if (amp) {
      return <pre className={classes.amp}>{this.reformat(error)}<br/><br/>{stack}</pre>
    } else {
      return <RedboxReact error={this.createError(this.reformat(error), stack)}/>
    }
  }

  /**
   * Creates an Error with the specified message and stack
   * @param {String} message 
   * @param {String[]} stack 
   * @return {Error}
   */
  createError(message, stack) {
    const error = new Error(this.reformat(message))
    error.stack = stack
    return error
  }

  /**
   * Adds additional helpful info to an error message
   * @param {String} message The original error message
   * @return {String} 
   */
  reformat(message) {
    try {
      if (message.includes('[mobx-state-tree] Error while converting')) {
        // mobx-state-tree error
        const filename = (message.match(/"filename":"(\w+)"/) || [])[1]
        const model = message.match(/is not assignable to type: `\((\w+) \|/)[1]
        const paths = message.match(/at path "([^"]*)"/g)
          .map(path => path.match(/at path "([^"]*)"/)[1])
  
        return `mobx-state-tree - attempted to assign a value of incorrect type to ${uniq(paths).join(', ')}${model === 'AnonymousModel' ? '' : ` in ${model}`}${filename ? ' (' + filename + ')' : ''}.`
      } else {
        return message
      }
    } catch (e) {
      return message
    }
  }

}
