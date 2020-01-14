import React, { useContext } from 'react'
import { List } from '@material-ui/core'
import MenuItem from './MenuItem'
import MenuBack from './MenuBack'
import MenuHeader from './MenuHeader'
import MenuFooter from './MenuFooter'
import MenuContext from './MenuContext'
import PropTypes from 'prop-types'

export default function MenuCard({ item, depth, headerProps }) {
  const { goBack, classes, expandFirstItem, drawerWidth } = useContext(MenuContext)

  return (
    <List
      style={{ width: `${drawerWidth}px` }}
      classes={{
        root: classes.list,
        padding: classes.padding,
      }}
      key={depth}
    >
      {!item.root && (
        <MenuBack
          classes={classes}
          goBack={() => goBack(depth - 1)}
          item={item}
          card={depth}
          {...headerProps}
        />
      )}

      <MenuHeader item={item} />

      {item.items &&
        item.items.map((child, i) => (
          <MenuItem
            item={child}
            key={item.key + '-' + i} // this ensures that the expanded state is after showing a new card
            depth={depth}
            defaultExpanded={i === 0 && expandFirstItem}
          />
        ))}

      <MenuFooter item={item} />
    </List>
  )
}

MenuCard.propTypes = {
  /**
   * Addition props for the header element
   */
  headerProps: PropTypes.object,
}

MenuCard.defaultProps = {}
