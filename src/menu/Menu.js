import React, { useMemo, useState, useRef, useEffect } from 'react'
import { Drawer } from '@mui/material'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import MenuContext from './MenuContext'
import SEOLinks from './SEOLinks'
import MenuBody from './MenuBody'

const PREFIX = 'RSFMenu'

const defaultClasses = {
  drawer: `${PREFIX}-drawer`,
  list: `${PREFIX}-list`,
  listPadding: `${PREFIX}-listPadding`,
  header: `${PREFIX}-header`,
  icon: `${PREFIX}-icon`,
  headerText: `${PREFIX}-headerText`,
  bodyWrap: `${PREFIX}-bodyWrap`,
  hidden: `${PREFIX}-hidden`,
  visible: `${PREFIX}-visible`,
  link: `${PREFIX}-link`,
  leaf: `${PREFIX}-leaf`,
  drawerFixed: `${PREFIX}-drawerFixed`,
}

const Menu = React.memo(props => {
  const {
    classes: c = {},
    className,
    anchor,
    drawerWidth,
    persistent,
    root,
    open,
    onClose,
    renderFooter,
    renderHeader,
    renderBack,
    renderItem,
    renderItemContent,
    renderDrawer,
    ...others
  } = props

  const classes = { ...defaultClasses, ...c }

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

  useEffect(() => {
    setState({
      card: 0,
      cards: [{ ...root, root: true }],
    })
  }, [root])

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
      renderBack,
      renderItem,
      renderItemContent,
      close: onClose,
      drawerWidth,
    }),
    [classes],
  )

  return (
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
   * A function to render a custom back navigation for menu cards.  It is passed
   * an object with:
   *
   * - item: The menu item record being rendered
   *
   * The function should return a React element or fragment.
   */
  renderBack: PropTypes.func,

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
  className: PropTypes.string,
}

Menu.defaultProps = {
  drawerWidth: 330,
  anchor: 'left',
  trackSelected: false,
  DrawerComponent: Drawer,
}

export default Menu
