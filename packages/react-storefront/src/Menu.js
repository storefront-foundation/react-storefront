/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { types } from "mobx-state-tree"
import React, { Component, Fragment } from 'react'
import { observer, inject } from "mobx-react"
import PropTypes from 'prop-types'
import Drawer from '@material-ui/core/Drawer'
import ListItemText from '@material-ui/core/ListItemText'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import withStyles from '@material-ui/core/styles/withStyles'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Collapse from '@material-ui/core/Collapse'
import Link from './Link' 
import classnames from 'classnames'
import AmpMenu from './amp/AmpMenu'
import withTheme from '@material-ui/core/styles/withTheme'

export const MenuItemModel = types
  .model("MenuItemModel", {
    text: types.optional(types.string, ''),
    url: types.maybeNull(types.string),
    state: types.frozen(),
    className: types.maybeNull(types.string),
    image: types.maybeNull(types.string),
    items: types.maybeNull(types.array(types.late(() => MenuItemModel))),
    root: types.optional(types.boolean, false),
    server: types.optional(types.boolean, false),
    prefetch: types.maybeNull(types.string),
    expanded: false
  })
  .actions(self => ({
    toggle() {
      self.expanded = !self.expanded
    },
    collapse() {
      self.expanded = false
    }
  }))

export const MenuModel = types
  .model("MenuModel", {
    open: false,
    levels: types.optional(types.array(MenuItemModel), []),
    level: types.optional(types.number, 0)
  })
  .actions(self => ({

    /**
     * Closes the menu
     */
    close() {
      self.open = false
    },

    /**
     * Toggles the open state of the menu
     */
    toggle() {
      self.open = !self.open
    },

    /**
     * Updates the root node
     * @param {Object} root 
     */
    setRoot(root) {
      self.levels[0] = MenuItemModel.create(root)
    },

    /**
     * Selects an item in the menu
     * @param {MenuItem} item
     * @param {Object} options
     */
    setSelected(item, options = {}) {
      item = MenuItemModel.create(item.toJSON())
      
      self.level++
      if (self.levels.length <= self.level) {
        self.levels.push(item)
      } else {
        self.levels[self.level] = item
      }

      if (options.expandFirstItem && item.items.every(itm => itm.expanded === false)) {
        item.items[0].expanded = true
      }
    },

    /**
     * Goes back one level
     */
    goBack() {
      self.level = Math.max(0, self.level - 1)
      self.collapseAll()
    },

    /**
     * Closes all expandable sections
     */
    collapseAll() {
      setTimeout(() => {
        for (let level of self.levels) {
          for (let item of level.items) {
            item.collapse()
          }
        }
      }, 200)
    }

  }))

export const styles = (theme) => ({
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
    padding: 0
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
    marginRight: '0'
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
    backgroundColor: `${theme.palette.primary.paper} !important`,
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
    itemRenderer: PropTypes.func
  }

  static defaultProps = {
    drawerWidth: 330,
    simple: false,
    expandFirstItem: false,
    align: 'left'
  }

  render() {
    const { app, classes, className, align, rootHeader, rootFooter, drawerWidth, simple, persistent, children } = this.props
    const { amp, menu } = app
    const { levels, level } = menu
    const position = -drawerWidth * level;

    if (!menu) {
      return null
    } else if (amp) {
      return <AmpMenu {...this.props}/>
    }

    return (
      <Drawer 
        variant={persistent ? 'persistent' : 'temporary' } 
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
            [classes.drawerFixed]: persistent, 
          }),
          modal: classes.modal 
        }}
      >
        { children }
        { simple ? this.renderSimple() : (
          <div className={classes.hbox} style={{ transform: `translateX(${position}px)`, flex: 1 }}>
            {levels.map((list, depth) => (
              <MenuList style={{ width: `${drawerWidth}px` }} classes={{ root: classes.list, padding: classes.padding }} key={depth}>
                {list.root && rootHeader}
                {!list.root && (
                  <MenuItem divider button onClick={this.goBack}>
                    <ListItemIcon classes={{ root: classes.header }}>
                      <ChevronLeft className={classes.icon} />
                    </ListItemIcon>
                    <ListItemText
                      classes={{ root: classes.headerText }}
                      primary={<div className={classes.headerText}>{list.text} </div>}
                    />
                  </MenuItem>
                )}
                {list.items && list.items.map((item, key) => this.renderItem(depth, item, key))}
                {list.root && rootFooter}
              </MenuList>
            ))}
          </div>
        )}
        { this.renderLinksForSEO() }
      </Drawer> 
    )
  }

  /**
   * @private
   * Renders simple anchor tags for all links in a collapsed div so that
   * search engine bots can crawl them.
   */
  renderLinksForSEO() {
    const levels = this.props.app.menu.levels
    const root = levels.length && levels[0]

    if (!root) return null
    
    let links = [], key = 0

    const findLinks = ({ items }) => {
      for (let i=0; i<items.length; i++) {
        const item = items[i]

        if (item.url) {
          links.push(<li key={key++}><Link to={item.url}>{item.text}</Link></li>)
        }

        if (item.items) {
          findLinks(item)
        }
      }
    }

    findLinks(root)

    return <noscript><ul>{links}</ul></noscript>
  }

  /**
   * Renders the menu as a simple list of expandable sections
   * @return {MenuList}
   */
  renderSimple() {
    const { rootHeader, rootFooter, app: { menu }, classes } = this.props
    const root = menu && menu.levels && menu.levels[0]

    if (!root) return null

    return (
      <MenuList classes={{ padding: classes.list }}>
        { rootHeader }
        { root.items.map((item, i) => this.renderItem(1, item, i)) }
        { rootFooter }
      </MenuList>
    )
  }

  /**
   * Renders a menu item
   * @param {Numbere} depth The depth of the item in the menu
   * @param {MenuItem} item The menu item
   * @param {String} key a key for the react element
   * @return {React.Element}
   */
  renderItem(depth, item, key) {
    if (item.items) {
      return this.renderGroup(depth, item, key)
    }
    return this.renderLeaf(item, key)    
  }

  renderGroup(depth, item, key) {
    let { app: { menu }, classes, useExpanders, simple } = this.props
    const showExpander = simple || (depth > 0 && useExpanders)

    const elements = [
      <MenuItem
        key={key}
        button
        divider
        onClick={showExpander ? this.toggleItemExpaned.bind(this, item) : this.slideToItem.bind(this, item, menu)}
        classes={{
          root: classnames(classes.listItem, item.className, {
            [classes.expanded]: item.expanded,
            [classes.expander]: showExpander
          })
        }}
      >
        { this.renderItemContents(item, false, showExpander) }
      </MenuItem>
    ]

    if (showExpander) {
      elements.push(
        <Collapse in={item.expanded} timeout="auto" key={`${key}-collapse`}>
          <MenuList component="div" classes={{ root: classes.list }}>
            {item.items && item.items.map(this.renderItem.bind(this, depth + 1))}
          </MenuList>
        </Collapse>
      )
    }

    return elements
  }

  renderLeaf(item, key) {
    const { classes, app: { location } } = this.props    

    return (
      <Link key={key} to={item.url} className={classes.link} server={item.server} state={item.state ? () => JSON.parse(item.state) : null}>
        <MenuItem
          button
          divider
          selected={location.pathname === item.url.replace(/\?.*/, '')}
          classes={{
            root: classnames(classes.listItem, classes.leaf, item.className)
          }}
        >
          { this.renderItemContents(item, true) }
        </MenuItem>
      </Link>
    );
  }

  renderItemContents(item, leaf, showExpander) {
    let { itemRenderer, classes, ExpandIcon, CollapseIcon, theme } = this.props

    let contents
    
    if (itemRenderer) {
      contents = itemRenderer(item, leaf)
    } 
    
    if (contents) {
      return contents
    } else if (leaf) {
      return (
        <Fragment>
          {item.image && (
            <ListItemIcon>
              <img className={classes.listItemImage} alt={item.text} src={item.image} />
            </ListItemIcon>
          )}
          <ListItemText
            primary={item.text}
            disableTypography
          />
        </Fragment>
      )
    } else {
      ExpandIcon = ExpandIcon || theme.ExpandIcon || ExpandMore
      CollapseIcon = CollapseIcon || theme.CollapseIcon || ExpandLess
  
      return (
        <Fragment>
          {item.image && (
            <ListItemIcon>
              <img className={classes.listItemImage} alt={item.text} src={item.image} />
            </ListItemIcon>
          )}
          <ListItemText
            primary={item.text}
            disableTypography
          />
          <ListItemIcon className={classes.listItemIcon}>
            {showExpander ? (
              item.expanded ? <CollapseIcon className={classes.icon} /> : <ExpandIcon className={classes.icon} />
            ) : (
              <ChevronRight className={classes.icon} />
            )}
          </ListItemIcon>
        </Fragment>
      )
    }
  }

  slideToItem = (item, menu) => {
    const { expandFirstItem } = this.props
    menu.setSelected(item, { expandFirstItem })
  }

  goBack = () => {
    this.props.app.menu.goBack()
  }

  toggleItemExpaned = (item) => {
    item.toggle()
  }

}
