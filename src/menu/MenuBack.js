import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { ChevronLeft } from '@mui/icons-material'
import MenuContext from './MenuContext'

export default function MenuBack({ goBack, item, backButtonProps }) {
  const { classes, renderBack } = useContext(MenuContext)

  return (
    <ListItem divider button onClick={goBack} {...backButtonProps}>
      <ListItemIcon classes={{ root: classes.header }}>
        <ChevronLeft className={classes.icon} />
      </ListItemIcon>
      <ListItemText
        classes={{ root: classes.headerText }}
        primary={
          <div className={classes.headerText}>
            {typeof renderBack === 'function' ? renderBack(item) : item.text}
          </div>
        }
      />
    </ListItem>
  )
}

MenuBack.propTypes = {
  /**
   * Goes back to the previous item in the menu hierarchy
   */
  goBack: PropTypes.func,
  /**
   * The menu item being rendered
   */
  item: PropTypes.shape({
    text: PropTypes.string,
  }).isRequired,
  backButtonProps: PropTypes.object,
}
