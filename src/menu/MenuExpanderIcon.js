import React, { useContext } from 'react'
import { ChevronRight, ExpandLess, ExpandMore } from '@mui/icons-material'
import PropTypes from 'prop-types'
import { useAmp } from 'next/amp'
import clsx from 'clsx'
import MenuContext from './MenuContext'

function ExpanderIcon({ ExpandIcon, CollapseIcon, showExpander, sublist, expanded }) {
  const { classes } = useContext(MenuContext)
  const amp = useAmp()

  ExpandIcon = ExpandIcon || ExpandMore
  CollapseIcon = CollapseIcon || ExpandLess

  if (!showExpander) return <ChevronRight className={classes.icon} />

  if (amp) {
    return (
      <>
        <CollapseIcon
          className={clsx(classes.icon, classes.hidden)}
          amp-bind={`class=>rsfMenuState.sublist == '${sublist}' ? '${classes.visible} ${classes.icon}' : '${classes.hidden} ${classes.icon}'`}
        />
        <ExpandIcon
          className={clsx(classes.icon, classes.visible)}
          amp-bind={`class=>rsfMenuState.sublist == '${sublist}' ? '${classes.hidden} ${classes.icon}' : '${classes.visible} ${classes.icon}'`}
        />
      </>
    )
  }
  return expanded ? (
    <CollapseIcon className={classes.icon} />
  ) : (
    <ExpandIcon className={classes.icon} />
  )
}

ExpanderIcon.propTypes = {
  ExpandIcon: PropTypes.any,
  CollapseIcon: PropTypes.any,
  showExpander: PropTypes.bool,
  sublist: PropTypes.any,
  expanded: PropTypes.any,
}

export default ExpanderIcon
