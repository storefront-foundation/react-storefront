/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React, { useState } from 'react'
import ReactVisibilitySensor from 'react-visibility-sensor'
import withStyles from '@material-ui/core/styles/withStyles'
import classnames from 'classnames'

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
  return (
    <ReactVisibilitySensor
      onChange={v => setVisible(visible || v)}
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
