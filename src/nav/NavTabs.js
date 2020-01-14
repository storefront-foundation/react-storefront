import React, { useMemo } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { Tabs } from '@material-ui/core'
import MuiTabScrollButton from '@material-ui/core/Tabs/TabScrollButton'
import { useRouter } from 'next/router'

export const styles = theme => ({
  indicatorNoSelection: {
    display: 'none',
  },
  scrollButtons: {
    position: 'absolute',
    height: '100%',
    right: 0,
    '&:first-child': {
      left: 0,
    },
    '& svg': {
      zIndex: 1,
      width: theme.spacing(5),
      background: theme.palette.background.paper,
    },
  },
  root: {
    maxWidth: theme.breakpoints.values.lg,
    flex: 1,
    position: 'relative',
    '&::before, &::after': {
      content: "''",
      top: 0,
      width: '15px',
      height: 'calc(100% - 3px)',
      position: 'absolute',
      zIndex: 1,
    },
    '&::before': {
      left: 0,
      background:
        'linear-gradient(to right, rgba(255, 255, 255, 1.0) 0%, rgba(255, 255, 255, 0.0) 100%)',
    },
    '&::after': {
      right: 0,
      background:
        'linear-gradient(to left, rgba(255, 255, 255, 1.0) 0%, rgba(255, 255, 255, 0.0) 100%)',
    },
  },
  ripple: {
    zIndex: 2,
  },
})

const useStyles = makeStyles(styles, { name: 'RSFNavTabs' })

/**
 * Scrollable navigation tabs for the top of the app. All extra props are spread to the
 * underlying Material UI Tabs element.  When a tab is clicked, the "top_nav_clicked" analytics
 * event is fired.
 */
export default function NavTabs({ classes = {}, children, ...others }) {
  const { paper, indicator, indicatorNoSelection, ripple, ...classNames } = classes
  classes = useStyles({ classes: { paper, indicator, indicatorNoSelection, ripple } })

  const { asPath } = useRouter()
  const value = children && children.findIndex(tab => tab.props.as === asPath.split('?')[0])

  const TabScrollButton = useMemo(() => {
    return props => (
      <MuiTabScrollButton {...props} TouchRippleProps={{ classes: { root: classes.ripple } }} />
    )
  }, [classes])

  return (
    <Tabs
      ScrollButtonComponent={TabScrollButton}
      variant="scrollable"
      classes={{
        ...classNames,
        indicator: clsx(classes.indicator, {
          [classes.indicatorNoSelection]: value === -1, // To cancel wierd animation when going from plp to pdp
        }),
      }}
      value={value === -1 ? false : value}
      {...others}
    >
      {children}
    </Tabs>
  )
}

NavTabs.propTypes = {}

NavTabs.defaultProps = {}
