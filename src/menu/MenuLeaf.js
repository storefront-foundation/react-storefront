import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import MenuItemContent from './MenuItemContent'
import Link from '../link/Link'
import MenuContext from './MenuContext'

const MenuLeaf = function({ item, ...others }) {
  const { close, classes } = useContext(MenuContext)

  return (
    <Link
      href={item.href}
      as={item.as}
      className={classes.link}
      pageData={item.pageData ? item.pageData : null}
      onClick={close}
    >
      <a>
        <MenuItemContent {...others} item={item} showExpander={false} leaf />
      </a>
    </Link>
  )
}

MenuLeaf.propTypes = {
  item: PropTypes.shape({
    as: PropTypes.string,
    pageData: PropTypes.object,
    href: PropTypes.string,
  }),
}

export default React.memo(MenuLeaf)
