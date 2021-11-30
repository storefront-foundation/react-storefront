import React, { useContext } from 'react'
import { ChevronRight, ExpandLess, ExpandMore } from '@mui/icons-material'
import MenuContext from './MenuContext'
import { useAmp } from 'next/amp'
import clsx from 'clsx'

export default function ExpanderIcon({
  ExpandIcon,
  CollapseIcon,
  showExpander,
  sublist,
  expanded,
}) {
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
  } else {
    return expanded ? (
      <CollapseIcon className={classes.icon} />
    ) : (
      <ExpandIcon className={classes.icon} />
    )
  }
}
