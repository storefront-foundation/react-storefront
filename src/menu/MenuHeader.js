import React, { useState, useEffect, useContext } from 'react'
import makeStyles from '@mui/material/styles/makeStyles'
import PropTypes from 'prop-types'
import CmsSlot from '../CmsSlot'
import MenuContext from './MenuContext'

export const styles = theme => ({
  root: {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
})
const useStyles = makeStyles(styles, { name: 'RSFMenuHeader' })

export default function MenuHeader({ classes, item }) {
  classes = useStyles({ classes })
  const { renderHeader } = useContext(MenuContext)

  if (typeof renderHeader === 'function') {
    return <div className={classes.root}>{renderHeader(item)}</div>
  }

  if (item.header) {
    return (
      <div className={classes.root}>
        <CmsSlot>{item.header}</CmsSlot>
      </div>
    )
  }

  return null
}

MenuHeader.propTypes = {
  /**
   * The menu item record
   */
  item: PropTypes.object,
}

MenuHeader.defaultProps = {}
