import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import SearchContext from './SearchContext'
import _fetch from '../fetch'
import debounce from 'lodash/debounce'
import { fetchLatest, StaleResponseError } from '../utils/fetchLatest'

const fetch = fetchLatest(_fetch)

export default function SearchProvider({ children, query, setQuery, initialGroups, active }) {
  const [state, setState] = useState({
    groups: initialGroups,
    loading: true,
  })

  useEffect(() => {
    if (active) {
      fetchSuggestions(query)
    }
  }, [active, query])

  const fetchSuggestions = debounce(async text => {
    try {
      setState(state => ({
        ...state,
        loading: true,
      }))

      const url = `/api/suggestions?q=${encodeURIComponent(text.trim())}`
      const { groups } = await fetch(url, { credentials: 'include' }).then(res => res.json())

      setState(state => ({
        ...state,
        loading: false,
        groups,
      }))
    } catch (e) {
      if (!StaleResponseError.is(e)) {
        setState(state => ({
          ...state,
          loading: false,
        }))
      }
    }
  }, 250)

  const context = {
    state,
    setState,
    fetchSuggestions,
    setQuery,
  }

  return <SearchContext.Provider value={context}>{children}</SearchContext.Provider>
}

SearchProvider.propTypes = {
  open: PropTypes.bool,
  initialGroups: PropTypes.array,
}
