import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { Clear as ClearIcon } from '@material-ui/icons'
import { Fab, IconButton, Button } from '@material-ui/core'

export const styles = theme => ({
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
  buttonText: {
    border: `1px solid #999`,
    margin: '0 0 10px 0',
  },
  buttonFab: {
    position: 'absolute',
    right: '10px',
    top: '-28px',
    zIndex: 1,
  },
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
  contrast,
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
      <Fab color="primary" className={clsx(!open && classes.hidden)} {...props}>
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
   * The name of the amp state corresponding to the drawer
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
   * Overrides the default icon
   */
  Icon: PropTypes.elementType,

  /**
   * Set to `true` when the drawer is open
   */
  open: PropTypes.bool,
}

DrawerCloseButton.defaultProps = {
  Icon: ClearIcon,
  open: false,
}
