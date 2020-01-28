import React, { Children } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import PropTypes from 'prop-types'

const useStyles = makeStyles(theme => ({
  /**
   * Styles applied to the root element.
   */
  root: {
    position: 'relative',
    width: '100%',
  },
  /**
   * Styles applied to the wrapper element for the children.
   */
  child: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    '& > *': {
      width: '100%',
      height: '100%',
    },
  },
}))

/**
 * This component sizes the height of the child element as a percentage of its width.  It expects
 * only a single child.
 *
 * Example:
 *
 * ```js
 *  <Fill height="100%">
 *    <div>this element's height will be the same as its width.</div>
 *  </Fill>
 * ```
 */
export default function Fill({ height, children, className, ...props }) {
  children = Children.only(children)

  if (height == null) {
    return children
  }

  const classes = useStyles()

  return (
    <div className={clsx(classes.root, className)} {...props}>
      <div style={{ paddingTop: height }} />
      <div className={classes.child}>{children}</div>
    </div>
  )
}

Fill.propTypes = {
  /**
   * The height as a percentage of the width in a css compatible expression.  For example:
   * `"100%"` or `"calc(100% + 50px)"`, etc...  If omitted, this component does nothing except render
   * the provided child.
   */
  height: PropTypes.string,
}
