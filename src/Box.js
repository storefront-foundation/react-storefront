/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'

/**
 * A flex container.  All additional props are spread to the style of the underlying div.
 */
export const styles = theme => ({
  root: {
    display: 'flex',
  },
  split: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

const useStyles = makeStyles(styles, 'RSFBox')

export default function Box({
  className,
  classes,
  split = false,
  children,
  style,
  align,
  justify,
  ...other
}) {
  classes = useStyles({ classes })

  return (
    <div
      className={clsx(classes.root, className, { [classes.split]: split })}
      style={{ alignItems: align, justifyContent: justify, ...other, ...style }}
    >
      {children}
    </div>
  )
}

Box.propTypes = {
  /**
   * CSS classes to apply
   */
  classes: PropTypes.object,

  /**
   * True to split items on opposite sides of the box by applying justify-content: 'space-between'
   */
  split: PropTypes.bool,

  /**
   * CSS value for align-items
   */
  align: PropTypes.oneOf(['flex-start', 'flex-end', 'center', 'stretch', 'baseline']),

  /**
   * CSS value for justify-content
   */
  justify: PropTypes.oneOf([
    'flex-start',
    'flex-end',
    'center',
    'space-around',
    'space-between',
    'initial',
    'inherit',
    'stretch',
    'baseline',
  ]),
}

Box.defaultProps = {
  align: 'center',
  justify: 'flex-start',
}

/**
 * A flex container with horizontal layout. All additional props are spread to the style
 * of the underlying div.
 */
export function Hbox(props) {
  props = { ...props, flexDirection: 'row' }
  return <Box {...props} />
}

Hbox.propTypes = {
  /**
   * CSS classes to apply
   */
  classes: PropTypes.object,

  /**
   * True to split items on opposite sides of the box by applying justify-content: 'space-between'
   */
  split: PropTypes.bool,

  /**
   * CSS value for align-items
   */
  align: PropTypes.oneOf(['flex-start', 'flex-end', 'center', 'stretch', 'baseline']),

  /**
   * CSS value for justify-content
   */
  justify: PropTypes.oneOf([
    'flex-start',
    'flex-end',
    'center',
    'space-around',
    'space-between',
    'initial',
    'inherit',
    'stretch',
    'baseline',
  ]),
}

Hbox.defaultProps = {
  align: 'center',
  justify: 'flex-start',
}

/**
 * A flex container with vertical layout. All additional props are spread to
 * the style of the underlying div.
 */
export function Vbox(props) {
  props = { ...props, flexDirection: 'column' }
  return <Box {...props} />
}

Vbox.propTypes = {
  /**
   * CSS classes to apply
   */
  classes: PropTypes.object,

  /**
   * CSS value for align-items
   */
  align: PropTypes.oneOf(['flex-start', 'flex-end', 'center', 'stretch', 'baseline']),

  /**
   * CSS value for justify-content
   */
  justify: PropTypes.oneOf([
    'flex-start',
    'flex-end',
    'center',
    'space-around',
    'space-between',
    'initial',
    'inherit',
    'stretch',
    'baseline',
  ]),
}

Vbox.defaultProps = {
  align: 'center',
  justify: 'flex-start',
}
