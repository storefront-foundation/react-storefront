import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'

/**
 * A flex container.  All additional props are spread to the style of the underlying div.
 */
export const styles = theme => ({
  /**
   * Styles applied to the root element.
   */
  root: {
    display: 'flex',
  },
  /**
   * Styles applied to the root element if [`split`](#prop-split) is `true`.
   */
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
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * If `true`, split items on opposite sides of the box by applying justify-content: 'space-between'
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
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * True to split items on opposite sides of the box by applying `justify-content: 'space-between'`.
   */
  split: PropTypes.bool,

  /**
   * CSS value for `align-items` style.
   */
  align: PropTypes.oneOf(['flex-start', 'flex-end', 'center', 'stretch', 'baseline']),

  /**
   * CSS value for `justify-content` style
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
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * CSS value for `align-items` style.
   */
  align: PropTypes.oneOf(['flex-start', 'flex-end', 'center', 'stretch', 'baseline']),

  /**
   * CSS value for `justify-content` style.
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
