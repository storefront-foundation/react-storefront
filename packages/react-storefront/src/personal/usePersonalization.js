/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import { useEffect, useContext } from 'react'
import AppContext from '../AppContext'
import { PageContext } from '../Pages'
import { reaction } from 'mobx'

/**
 * A hook for fetching late-loaded personalized data.  This hook automatically
 * calls the `loadPersonalization()` method on the model in the specified `branch` in the app
 * state tree whenever the model's id field changes.
 * @param {String} branch The name of the branch in the app state tree.  For example "product" or "category".
 * @return {Function}
 */
export default function usePersonalization(branch) {
  const { app } = useContext(AppContext)
  const page = useContext(PageContext)

  const loadPersonalization = ready => {
    if (ready) {
      app[branch].loadPersonalization()
    }
  }

  const isReady = () => {
    return !app.loading && (app[branch] && app[branch].id) && app.page === page
  }

  useEffect(() => {
    loadPersonalization(isReady())
    return reaction(isReady, loadPersonalization)
  }, [])
}
