import React, { useState, useEffect, useContext } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import PropTypes from 'prop-types'
import CmsSlot from '../CmsSlot'

export const styles = theme => ({
  root: {
    padding: theme.spacing(2),
  },
})
const useStyles = makeStyles(styles, { name: 'RSFMenuFooter' })

export default function MenuFooter({ classes, item }) {
  classes = useStyles({ classes })

  if (item.footer) {
    return (
      <div className={classes.root}>
        <CmsSlot>{item.footer}</CmsSlot>
      </div>
    )
  } else {
    return null
  }
}

MenuFooter.propTypes = {
  /**
   * The menu item record
   */
  item: PropTypes.object,
}

MenuFooter.defaultProps = {}
