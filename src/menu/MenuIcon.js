import React from 'react'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { useAmp } from 'next/amp'

const PREFIX = 'RSFMenuIcon'

const classes = {
  root: `${PREFIX}-root`,
  active: `${PREFIX}-active`,
  withLabel: `${PREFIX}-withLabel`,
  hidden: `${PREFIX}-hidden`,
  visible: `${PREFIX}-visible`,
  label: `${PREFIX}-label`,
}

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
  [`& .${classes.root}`]: {
    position: 'relative',
    height: '24px',
    width: '24px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    '& .rsf-hamburger': {
      display: 'block',
      marginTop: '5px',
    },

    '& .rsf-hamburger-box': {
      width: '20px',
      height: '20px',
      display: 'block',
      position: 'relative',
    },

    '& .rsf-hamburger-inner': {
      display: 'block',
      top: '50%',
      marginTop: '-4px',
    },

    '& .rsf-hamburger-inner, & .rsf-hamburger-inner::before, & .rsf-hamburger-inner::after': {
      width: '20px',
      height: '2px',
      backgroundColor: theme.palette.text.secondary,
      borderRadius: '4px',
      position: 'absolute',
      transitionProperty: 'transform',
      transitionDuration: theme.transitions.duration.standard,
      transitionTimingFunction: 'ease',
    },

    '& .rsf-hamburger-inner::before, & .rsf-hamburger-inner::after': {
      content: '""',
      display: 'block',
    },

    '& .rsf-hamburger-inner::before': {
      top: '-10px',
    },

    '& .rsf-hamburger-inner::after': {
      bottom: '-10px',
    },

    '& .rsf-hamburger .rsf-hamburger-inner': {
      top: '5px',
    },

    '& .rsf-hamburger .rsf-hamburger-inner::before': {
      top: '5px',
      transitionProperty: 'transform, opacity',
      transitionTimingFunction: 'ease',
      transitionDuration: theme.transitions.duration.standard,
    },

    '& .rsf-hamburger .rsf-hamburger-inner::after': {
      top: '10px',
    },
  },

  [`& .${classes.active}`]: {
    '& .rsf-hamburger .rsf-hamburger-inner': {
      transform: 'translate3d(0, 5px, 0) rotate(45deg)',
    },

    '& .rsf-hamburger .rsf-hamburger-inner::before': {
      transform: 'rotate(-45deg) translate3d(-5.71429px, -5px, 0)',
      opacity: 0,
    },

    '& .rsf-hamburger .rsf-hamburger-inner::after': {
      transform: 'translate3d(0, -10px, 0) rotate(-90deg)',
    },
  },

  [`& .${classes.withLabel}`]: {
    '& .rsf-hamburger': {
      marginTop: '0',
    },
  },

  [`& .${classes.hidden}`]: {
    display: 'none',
  },

  [`& .${classes.visible}`]: {
    display: 'block',
  },

  [`& .${classes.label}`]: {
    fontSize: '9px',
    lineHeight: '9px',
    fontWeight: 'bold',
    letterSpacing: '0px',
    marginTop: '-3px',
    color: theme.palette.text.secondary,
  },
}))

export {}

/**
 * A menu icon that animates transitions between open and closed states.
 */
export default function MenuIcon({ label, open }) {
  const amp = useAmp()

  const renderIcon = open => {
    return (
      <div
        className={clsx({
          [classes.root]: true,
          [classes.active]: open,
          [classes.withLabel]: label,
        })}
      >
        <div className="rsf-hamburger">
          <span className="rsf-hamburger-box">
            <span className="rsf-hamburger-inner" />
          </span>
        </div>
        {label && <div className={classes.label}>menu</div>}
      </div>
    )
  }

  if (amp) {
    return (
      <Root>
        <div
          className={classes.visible}
          amp-bind={`class=>!rsfMenuState.open ? '${classes.visible}' : '${classes.hidden}'`}
        >
          {renderIcon(false)}
        </div>
        <div
          className={classes.hidden}
          amp-bind={`class=>rsfMenuState.open ? '${classes.visible}' : '${classes.hidden}'`}
        >
          {renderIcon(true)}
        </div>
      </Root>
    )
  } else {
    return renderIcon(open)
  }
}

MenuIcon.propTypes = {
  /**
   * Set to true when the menu is open, otherwise false
   */
  open: PropTypes.bool,

  /**
   * Set to `false` to hide the text "menu" underneath the button when the menu is closed.
   */
  label: PropTypes.bool,
}

MenuIcon.defaultProps = {
  open: false,
  label: false,
}
