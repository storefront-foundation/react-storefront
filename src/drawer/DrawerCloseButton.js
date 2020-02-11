import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { Clear as ClearIcon } from '@material-ui/icons'
import { Fab, IconButton, Button } from '@material-ui/core'

export const styles = theme => ({
  /**
   * Styles applied to the root element.
   */
  button: {
    color: '#999',
    alignSelf: 'flex-end',
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
    '& span': {
      textTransform: 'uppercase',
      fontWeight: 'bold',
    },
  },
  /**
   * Styles applied to the root element, if [`text`](#prop-text) is defined.
   */
  buttonText: {
    border: `1px solid #999`,
    margin: '0 0 10px 0',
  },
  /**
   * Styles applied to the root element, if [`text`](#prop-text) is not defined and
   * [`fullscreen`](#prop-fullscreen) is `false`.
   */
  buttonFab: {
    position: 'absolute',
    right: '10px',
    top: '-28px',
    zIndex: 1,
    color: 'white',
  },
  /**
   * Styles applied to hide the `Fab` button when [`open`](#prop-open) is `false`.
   */
  hidden: {
    display: 'none',
  },
})

const useStyles = makeStyles(styles, { name: 'RSFDrawerCloseButton' })

/**
 * A close button for drawers that can display text or an icon.
 */
export default function DrawerCloseButton({
  classes,
  className,
  ampState,
  onClick,
  text,
  Icon,
  fullscreen,
  open,
  ...others
}) {
  classes = useStyles({ classes })

  let ButtonElement

  if (text) {
    ButtonElement = Button
  } else if (fullscreen) {
    ButtonElement = IconButton
  } else {
    ButtonElement = props => (
      <Fab color="primary" {...props} className={clsx(props.className, !open && classes.hidden)}>
        <Icon />
      </Fab>
    )
  }

  return (
    <ButtonElement
      color="primary"
      on={`tap:AMP.setState({ ${ampState}: { open: false } })`}
      className={clsx(className, {
        [classes.button]: true,
        [classes.buttonText]: text != null,
        [classes.buttonFab]: text == null && !fullscreen,
      })}
      onClick={onClick}
      {...others}
    >
      {text || <Icon />}
    </ButtonElement>
  )
}

DrawerCloseButton.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * CSS class to apply to the root element.
   */
  className: PropTypes.string,

  /**
   * The name of the amp state corresponding to the drawer.
   */
  ampState: PropTypes.string,

  /**
   * Fired when the button is clicked.  Call `e.preventDefault()` on the
   * provided event to prevent the drawer from closing.
   */
  onClick: PropTypes.func,

  /**
   * When set, this text will be displayed instead of an icon.
   */
  text: PropTypes.string,

  /**
   * Overrides the default icon.
   */
  Icon: PropTypes.elementType,

  /**
   * If `true`, the drawer is open
   */
  open: PropTypes.bool,

  /**
   * If `true`, the drawer is fullscreen and the close button will therefore be a `Fab` button.
   */
  fullscreen: PropTypes.bool,
}

DrawerCloseButton.defaultProps = {
  Icon: ClearIcon,
  open: false,
}
