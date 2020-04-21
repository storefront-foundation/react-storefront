import React, { useState, useEffect, useContext } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import PropTypes from 'prop-types'
import CmsSlot from '../CmsSlot'
import MenuContext from './MenuContext'

export const styles = theme => ({
  root: {
    padding: theme.spacing(2),
  },
})
const useStyles = makeStyles(styles, { name: 'RSFMenuFooter' })

export default function MenuFooter({ classes, item }) {
  classes = useStyles({ classes })
  const { renderFooter } = useContext(MenuContext)

  if (typeof renderFooter === 'function') {
    return <div className={classes.root}>{renderFooter(item)}</div>
  }

  if (item.footer) {
    return (
      <div className={classes.root}>
        <CmsSlot>{item.footer}</CmsSlot>
      </div>
    )
  }

  return null
}

MenuFooter.propTypes = {
  /**
   * The menu item record
   */
  item: PropTypes.object,
}

MenuFooter.defaultProps = {}
