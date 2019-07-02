/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import { types, flow } from 'mobx-state-tree'
import fetch from 'fetch'

export const MenuItemModel = types
  .model('MenuItemModel', {
    text: types.optional(types.string, ''),
    url: types.maybeNull(types.string),
    state: types.frozen(),
    className: types.maybeNull(types.string),
    image: types.maybeNull(types.string),
    items: types.maybeNull(types.array(types.late(() => MenuItemModel))),
    root: types.optional(types.boolean, false),
    server: types.optional(types.boolean, false),
    prefetch: types.maybeNull(types.string),
    loading: false,
    lazyItemsURL: types.maybeNull(types.string),
    expanded: false
  })
  .views(self => ({
    hasChildren() {
      return self.items != null || self.lazyItemsURL != null
    }
  }))
  .actions(self => ({
    toggle: flow(function*() {
      if (self.items == null && self.lazyItemsURL) {
        self.loading = true

        self.items = yield fetch(self.lazyItemsURL)
          .then(res => res.json())
          .then(result => result.items)

        self.loading = false
      }
      self.expanded = !self.expanded
    }),
    collapse() {
      self.expanded = false
    }
  }))

export const MenuModel = types
  .model('MenuModel', {
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
     * @param {MenuItemModel} item
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
