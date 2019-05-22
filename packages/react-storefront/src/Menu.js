/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component, Fragment } from 'react'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import Drawer from '@material-ui/core/Drawer'
import withStyles from '@material-ui/core/styles/withStyles'
import classnames from 'classnames'
import AmpMenu from './amp/AmpMenu'
import withTheme from '@material-ui/core/styles/withTheme'
import Body from './menu/Body'
import SEOLinks from './menu/SEOLinks'
import MenuContext from './menu/MenuContext'
import AmpSimpleMenu from './amp/AmpSimpleMenu'

export { MenuModel, MenuItemModel } from './model/MenuModel'

export const styles = theme => ({
  drawer: {
    zIndex: theme.zIndex.modal + 20,
    display: 'flex',
    flexDirection: 'column',
    borderTop: `${theme.headerHeight}px solid transparent`,
    'body.moov-safari &': {
      // Turning off momentum scrolling on iOS here to fix frozen body issue
      // Source: https://moovweb.atlassian.net/browse/PRPL-342
      '-webkit-overflow-scrolling': 'auto'
    }
  },

  list: {
    flex: 'none',
    overflowY: 'auto',
    overflowX: 'hidden',
    maxHeight: '100%',
    padding: 0
  },

  ampList: {
    flex: 'none',
    overflowX: 'hidden',
    padding: 0
  },

  ampBody: {
    overflowY: 'auto',
    height: '100%',
    left: 0,
    top: 0,
    position: 'absolute',
    width: '100%',
    flex: '1 1 0%',
    transition: 'transform ease-out .2s'
  },

  hiddenLeft: {
    transform: `translateX(-${theme.drawerWidth}px)`
  },

  hiddenRight: {
    transform: `translateX(${theme.drawerWidth}px)`
  },

  inFocus: {
    transform: 'translateX(0px)'
  },

  listPadding: {
    padding: 0
  },

  header: {
    position: 'absolute',
    left: '10px',
    top: '12px'
  },

  icon: {
    marginRight: '0',
    width: 24
  },

  headerText: {
    textAlign: 'center',
    fontWeight: '600',
    textTransform: 'uppercase',
    fontSize: theme.typography.body1.fontSize
  },

  hbox: {
    display: 'flex',
    flexDirection: 'row',
    transition: 'all ease-out .2s'
  },

  hidden: {
    display: 'none'
  },

  visible: {
    display: 'block'
  },

  listItem: {
    textTransform: 'uppercase',
    lineHeight: 'initial',
    fontSize: theme.typography.body1.fontSize
  },

  link: {
    textDecoration: 'none',
    color: 'inherit'
  },

  listItemImage: {
    width: '40px',
    height: '40px',
    marginRight: 0
  },

  listItemIcon: {
    marginRight: 0
  },

  expander: {
    backgroundColor: `${theme.palette.primary.paper} !important`
  },

  leaf: {
    textTransform: 'none',
    ...theme.typography.body1
  },

  expanded: {
    backgroundColor: `${theme.palette.secondary.main} !important`,
    color: theme.palette.secondary.contrastText,
    '& svg': {
      color: theme.palette.secondary.contrastText
    }
  },

  drawerFixed: {
    top: 0,
    height: '100vh',
    borderTop: 'none'
  },

  modal: {}
})

/**
 * The main app menu that slides in from the left when the AppHeader's menu button is clicked.
 * Children are rendered above the list of menu items.
 *
 * In addition to the CSS classes that can be overridden of menu subcomponents, you can also
 * assign specific classes to individual menu items by specifying a value for the `className`
 * field on any instance of `MenuItemModel`.
 */
@withTheme()
@withStyles(styles, { name: 'RSFMenu' })
@inject('app')
@observer
export default class Menu extends Component {
  static propTypes = {
    menu: PropTypes.object,

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
     * Set to true to use expandable menu items below depth 1
     */
    useExpanders: PropTypes.bool,

    /**
     * Set to true to expand first item for not root items
     */
    expandFirstItem: PropTypes.bool,

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
     * Set to true to render a simple set of expanders rather than a multi-level drill down.
     * Defaults to false.
     */
    simple: PropTypes.bool,

    /**
     * The icon to use for collapsed groups
     */
    ExpandIcon: PropTypes.func,

    /**
     * The icon to use for expanded groups
     */
    CollapseIcon: PropTypes.func,

    /**
     * Sets the side of the screen from which the menu appears.
     */
    align: PropTypes.oneOf(['left', 'right']),

    /**
     * A function to render the contents of a menu item.  It is passed the following arguments:
     *
     * 1.) item - the MenuItemModel instance.
     * 2.) leaf - `true` when the item is a leaf node, otherwise `false`
     *
     * Return undefined to render the default contents
     *
     * Example:
     *
     *  itemRenderer={(item, leaf) => {
     *    return leaf ? <ListItemText primary={item.text}/> : undefined
     *  }}
     */
    itemRenderer: PropTypes.func,

    /**
     * Set to `true` to show the item corresponding to the current URL as selected.
     */
    trackSelected: PropTypes.bool
  }

  static defaultProps = {
    drawerWidth: 330,
    simple: false,
    expandFirstItem: false,
    align: 'left',
    trackSelected: false
  }

  constructor({ classes }) {
    super()
    this.menuContext = { classes }
  }

  render() {
    const {
      app,
      classes,
      className,
      align,
      drawerWidth,
      persistent,
      simple,
      ...others
    } = this.props
    const { amp, menu } = app

    if (!menu) {
      return null
    } else if (amp) {
      if (simple) {
        return <AmpSimpleMenu {...this.props} />
      } else {
        return (
          <MenuContext.Provider value={this.menuContext}>
            <AmpMenu {...this.props} />
          </MenuContext.Provider>
        )
      }
    } else {
      return (
        <Fragment>
          <Drawer
            variant={persistent ? 'persistent' : 'temporary'}
            open={menu.open || persistent}
            onClose={menu.close}
            anchor={align}
            ModalProps={{
              keepMounted: true
            }}
            PaperProps={{
              style: { width: `${drawerWidth}px` }
            }}
            classes={{
              root: className,
              paper: classnames(classes.drawer, {
                [classes.drawerFixed]: persistent
              }),
              modal: classes.modal
            }}
          >
            <MenuContext.Provider value={this.menuContext}>
              <Body drawerWidth={drawerWidth} simple={simple} {...others} />
            </MenuContext.Provider>
          </Drawer>
          <SEOLinks />
        </Fragment>
      )
    }
  }
}
