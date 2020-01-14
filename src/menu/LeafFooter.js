import { useContext } from 'react'
import MenuContext from './MenuContext'
import PropTypes from 'prop-types'

export default function LeafFooter({ item }) {
  const { renderLeafFooter } = useContext(MenuContext)

  if (renderLeafFooter) {
    return renderLeafFooter({ item })
  } else {
    return null
  }
}

LeafFooter.propTypes = {
  /**
   * The menu item being rendered
   */
  item: PropTypes.object,
}
