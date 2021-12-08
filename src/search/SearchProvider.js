import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import SearchContext from './SearchContext'
import _fetch from '../fetch'
import useDebounce from '../utils/useDebounce'
import { fetchLatest, StaleResponseError } from '../utils/fetchLatest'
import getAPIURL from '../api/getAPIURL'

const fetch = fetchLatest(_fetch)

export default function SearchProvider({
  children,
  query,
  initialGroups,
  active,
  minQueryLength,
  debounceTime,
}) {
  const [state, setState] = useState({
    groups: initialGroups,
    loading: true,
  })

  const debouncedQuery = useDebounce(query, debounceTime)

  const fetchSuggestions = async text => {
    try {
      setState(state => ({
        ...state,
        loading: true,
      }))

      const url = getAPIURL(`/suggestions?q=${encodeURIComponent(text.trim())}`)
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
  }

  useEffect(() => {
    if (active && (debouncedQuery.length >= minQueryLength || !debouncedQuery)) {
      fetchSuggestions(debouncedQuery)
    }
  }, [active, debouncedQuery])

  const context = {
    query: debouncedQuery,
    state,
    setState,
    fetchSuggestions,
  }

  return <SearchContext.Provider value={context}>{children}</SearchContext.Provider>
}

SearchProvider.propTypes = {
  open: PropTypes.bool,
  initialGroups: PropTypes.array,
  /**
   * Minimum length of search query to fetch. Default is 3
   */
  minQueryLength: PropTypes.number,
  /**
   * Default is 250
   */
  debounceTime: PropTypes.number,
  query: PropTypes.string,
  active: PropTypes.bool,
}

SearchProvider.defaultProps = {
  minQueryLength: 3,
  debounceTime: 250,
}
