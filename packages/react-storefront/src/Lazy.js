/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React, { useState, useContext } from 'react'
import ReactVisibilitySensor from 'react-visibility-sensor'
import withStyles from '@material-ui/core/styles/withStyles'
import classnames from 'classnames'
import AppContext from './AppContext'

export const styles = () => ({
  root: {
    minHeight: 10
  }
})

/**
 * Lazy loads its children when the user scrolls near it
 *
 * Props are passed through to the container element
 *
 * @param {ReactChildren} props.children React elements to be loaded lazy
 */
function Lazy({ children, className, classes, ...otherProps }) {
  const [visible, setVisible] = useState(false)
  const appContext = useContext(AppContext)

  return (
    <ReactVisibilitySensor
      onChange={v => setVisible(!appContext.scrollResetPending && (visible || v))}
      active={!visible}
      partialVisibility
    >
      <div className={classnames(classes.root, className)} {...otherProps}>
        {visible && children}
      </div>
    </ReactVisibilitySensor>
  )
}

export default withStyles(styles, { name: 'RSFLazy' })(Lazy)
