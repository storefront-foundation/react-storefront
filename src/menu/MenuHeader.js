import React, { useState, useEffect, useContext } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import PropTypes from 'prop-types'
import CmsSlot from '../CmsSlot'

export const styles = theme => ({
  root: {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
})
const useStyles = makeStyles(styles, { name: 'RSFMenuHeader' })

export default function MenuHeader({ classes, item }) {
  classes = useStyles({ classes })

  if (item.header) {
    return (
      <div className={classes.root}>
        <CmsSlot>{item.header}</CmsSlot>
      </div>
    )
  } else {
    return null
  }
}

MenuHeader.propTypes = {
  /**
   * The menu item record
   */
  item: PropTypes.object,
}

MenuHeader.defaultProps = {}
