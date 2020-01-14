import React, { useContext } from 'react'
import MenuItemContent from './MenuItemContent'
import Link from '../link/Link'
import MenuContext from './MenuContext'

function MenuLeaf({ item, trackSelected, ...others }) {
  const { close, classes } = useContext(MenuContext)

  return (
    <Link
      href={item.href}
      as={item.as}
      className={classes.link}
      server={item.server}
      state={item.state ? () => JSON.parse(item.state) : null}
      onClick={close}
    >
      <a>
        <MenuItemContent {...others} item={item} showExpander={false} leaf />
      </a>
    </Link>
  )
}

export default React.memo(MenuLeaf)
