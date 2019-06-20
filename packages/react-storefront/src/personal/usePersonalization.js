/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import { useEffect, useContext } from 'react'
import AppContext from '../AppContext'
import { reaction } from 'mobx'

/**
 * A hook for fetching late-loaded personalized data.  This hook automatically
 * calls the `loadPersonalization()` method on the model in the specified `branch` in the app
 * state tree whenever the model's id field changes.
 *
 * Example
 *
 * ```js
 *  function Product() {
 *    usePersonalization(app => app.product)
 *    return //...
 *  }
 * ```
 *
 * @param {Function} branch A function that returns the model that should fetch personalized data.
 * @return {Function}
 */
export default function usePersonalization(branch) {
  const { app } = useContext(AppContext)

  const loadPersonalization = ready => {
    const model = branch(app)

    if (model == null) {
      return
    } else if (model.loadPersonalization) {
      if (ready) {
        model.loadPersonalization()
      }
    } else {
      console.warn(
        `The model at ${branch} does not implement loadPersonalization.  You should implement this action so that usePersonalization/withPersonalization can load personalized data from the server.`
      )
    }
  }

  const shouldFetchPersonalization = () => !app.loading && branch(app)

  useEffect(() => {
    // check if we should load personalization data immediately as is the case if
    // the user initially lands on a page with usePersonalization
    loadPersonalization(shouldFetchPersonalization())

    // it is critical that we return the reaction disposer here (returned by reaction)
    // so that the reaction is disposed when the component unmounts
    return reaction(shouldFetchPersonalization, loadPersonalization)
  }, [])
}
