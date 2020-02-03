import React, { useMemo, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import SearchContext from './SearchContext'
import _fetch from 'isomorphic-unfetch'
import debounce from 'lodash/debounce'
import { fetchLatest, StaleResponseError } from '../utils/fetchLatest'
import useNavigationEvent from '../hooks/useNavigationEvent'

const fetch = fetchLatest(_fetch)

export default function SearchProvider({ children, initialGroups, onClose, open }) {
  const [state, setState] = useState({
    groups: initialGroups,
    loading: true,
  })

  useEffect(() => {
    if (open && state.groups == null) {
      fetchSuggestions('')
    }
  }, [open])

  useNavigationEvent(onClose)

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

  // const context = useMemo(
  //   () => ({
  //     state,
  //     setState,
  //     fetchSuggestions,
  //     onClose,
  //     submit
  //   }),
  //   [state]
  // )

  const context = {
    state,
    setState,
    fetchSuggestions,
    onClose,
  }

  return <SearchContext.Provider value={context}>{children}</SearchContext.Provider>
}

SearchProvider.propTypes = {
  open: PropTypes.bool,
  initialGroups: PropTypes.array,
  onClose: PropTypes.func,
}
