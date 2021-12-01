import React from 'react'
import { makeStyles } from '@mui/styles'
import { Typography } from '@mui/material'
import { CloudOff as CloseOffIcon } from '@mui/icons-material'
import PropTypes from 'prop-types'

const styles = theme => ({
  /**
   * Styles applied to the root element.
   */
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    marginTop: '40px',
    color: '#999',
  },
  /**
   * Styles applied to the icon element.
   */
  icon: {
    fontSize: 60,
    color: '#999',
  },
  /**
   * Styles applied to the heading element.
   */
  heading: {},
  /**
   * Styles applied to the message element.
   */
  message: {},
})

const useStyles = makeStyles(styles, { name: 'RSFOffline' })

/**
 * A page to display when in Offline mode
 */
export default function Offline({ classes, heading, message, Icon }) {
  classes = useStyles({ classes })

  return (
    <div className={classes.root}>
      <Icon className={classes.icon} />
      <Typography variant="h6" component="h1" className={classes.heading}>
        {heading}
      </Typography>
      <Typography variant="caption" className={classes.message}>
        {message}
      </Typography>
    </div>
  )
}

Offline.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * Text (or an element) to display as the heading.
   */
  heading: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

  /**
   * Text (or an element) to display as the message.
   */
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

  /**
   * An icon to display.
   */
  Icon: PropTypes.elementType,
}

Offline.defaultProps = {
  heading: "You're offline",
  message: 'Please check your internet connection',
  Icon: () => <CloseOffIcon />,
}
