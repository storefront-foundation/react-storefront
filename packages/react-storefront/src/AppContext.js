/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import { createContext } from 'react'

/**
 * Allows you to import the global application context into components.
 *
 * Contains the following properties:
 *
 * - app: The mobx-state-tree `AppModel` instance
 * - history: The JS history instance
 * - router: The router exported from `routes.js`
 * - errorReporter: The global error reporter exported by `errorReporter.js`
 *
 * Example: Displaying a product using the app state tree
 *
 * ```js
 *  import React, { useContext } from 'react'
 *  import { useObserver } from 'mobx-react-lite'
 *  import AppContext from 'react-storefront/AppContext'
 *
 *  function Product() {
 *    return useObserver(() => {
 *      const { app: { product } } = useContext(AppContext)
 *
 *      return (
 *        <div>
 *          <h1>{product.name}</h1>
 *        </div>
 *      )
 *    })
 *  }
 * ```
 */
export default createContext()
