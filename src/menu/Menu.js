import React, { useMemo, useState, useRef, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import menuStyles from './menuStyles'
import MenuContext from './MenuContext'
import { Drawer } from '@material-ui/core'
import clsx from 'clsx'
import SEOLinks from './SEOLinks'
import MenuBody from './MenuBody'
import PropTypes from 'prop-types'

export const styles = menuStyles

const useStyles = makeStyles(styles, { name: 'RSFMenu' })

const Menu = React.memo(props => {
  let {
    classes,
    className,
    anchor,
    drawerWidth,
    persistent,
    root,
    open,
    onClose,
    renderFooter,
    renderHeader,
    renderItem,
    renderItemContent,
    renderDrawer,
    ...others
  } = props

  classes = useStyles({ classes })

  const [state, setState] = useState(() => {
    return {
      card: 0,
      cards: [{ ...root, root: true }],
    }
  })

  // this is needed so we can always update the *current* state, not the snapshot that
  // was present when the callbacks were memoized
  const stateRef = useRef(state)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  // this ensures that the expanded state is reset when showing a new card
  const nextKey = useRef(0)

  const onItemClick = (item, depth) => {
    const cards = [...stateRef.current.cards]
    const card = depth + 1

    item.key = nextKey.current++ // this ensures that the expanded state is reset when showing a new card

    if (card >= cards.length) {
      cards.push(item)
    } else {
      cards[card] = item
    }

    setState({
      card,
      cards: cards.slice(0, card + 1),
    })
  }

  const goBack = card => {
    setState({
      card,
      cards: stateRef.current.cards,
    })
  }

  // it is important to memoize the context, otherwise it will cause all consumers to rerender
  // every time Menu rerenders
  const context = useMemo(
    () => ({
      classes,
      onItemClick,
      goBack,
      renderFooter,
      renderHeader,
      renderItem,
      renderItemContent,
      close: onClose,
      drawerWidth,
    }),
    [classes],
  )

  return (
    <>
      <MenuContext.Provider value={context}>
        {renderDrawer ? (
          renderDrawer()
        ) : (
          <Drawer
            variant={persistent ? 'persistent' : 'temporary'}
            open={open || persistent}
            onClose={onClose}
            anchor={anchor}
            ModalProps={{
              keepMounted: true,
            }}
            PaperProps={{
              style: { width: `${drawerWidth}px` },
            }}
            classes={{
              root: className,
              paper: clsx(classes.drawer, {
                [classes.drawerFixed]: persistent,
              }),
              modal: classes.modal,
            }}
          >
            <MenuBody
              card={state.card}
              cards={state.cards}
              root={root}
              drawerWidth={drawerWidth}
              {...others}
            />
          </Drawer>
        )}
        <SEOLinks root={root} />
      </MenuContext.Provider>
    </>
  )
})

Menu.propTypes = {
  root: PropTypes.object,

  /**
   * The width of the drawer in pixels
   */
  drawerWidth: PropTypes.number,

  /**
   * An element to display at the top of the root of the menu
   */
  rootHeader: PropTypes.element,

  /**
   * An element to display at the bottom of the root of the menu
   */
  rootFooter: PropTypes.element,

  /**
   * A function to render a custom header in menu cards.  It is passed an object
   * with:
   *
   * - item: The menu item record being rendered
   *
   * The function should return a React element or fragment.
   */
  renderHeader: PropTypes.func,

  /**
   * A function to render a custom footer menu cards.  It is passed an object
   * with:
   *
   * - item: The menu item record being rendered
   *
   * The function should return a React element or fragment.
   */
  renderFooter: PropTypes.func,

  /**
   * Set to true to display the menu
   */
  open: PropTypes.bool,

  /**
   * Set to true to dock the menu so that it's always open and not modal
   */
  persistent: PropTypes.bool,

  /**
   * CSS classes for this component
   */
  classes: PropTypes.objectOf(PropTypes.string),

  /**
   * Called when the menu is closed
   */
  onClose: PropTypes.func,

  /**
   * The icon to use for collapsed groups
   */
  ExpandIcon: PropTypes.elementType,

  /**
   * The icon to use for expanded groups
   */
  CollapseIcon: PropTypes.elementType,

  /**
   * Sets the side of the screen from which the menu appears.
   */
  anchor: PropTypes.oneOf(['left', 'right']),

  /**
   * Overrides the default rendering of a menu item.  It is passed the following arguments:
   *
   * - item - the menu item record being rendered.
   *
   * Return undefined to render the default contents
   *
   * Example:
   *
   * ```js
   *  renderItem={item => {
   *    return item.text === 'My Special Item ? <MySpecialItem/> : null
   *  }}
   * ```
   */
  renderItem: PropTypes.func,

  /**
   * Overrides the content of a menu item.  It is passed the following arguments:
   *
   * - item - the menu item record being rendered.
   *
   * Return null to render the default contents
   *
   * Example:
   *
   * ```js
   *  renderItemContent={item => {
   *    return leaf ? <ListItemText primary={item.text}/> : null
   *  }}
   * ```
   */
  renderItemContent: PropTypes.func,

  /**
   * Set to `true` to show the item corresponding to the current URL as selected.
   */
  trackSelected: PropTypes.bool,

  /**
   * A function to override the rendering the drawer
   */
  renderDrawer: PropTypes.func,
}

Menu.defaultProps = {
  drawerWidth: 330,
  anchor: 'left',
  trackSelected: false,
  DrawerComponent: Drawer,
}

export default Menu
