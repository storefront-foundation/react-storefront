import React from 'react'
import CheckboxFilterGroup from '../../src/plp/CheckboxFilterGroup'
import SearchResultsContext from '../../src/plp/SearchResultsContext'

export default { title: 'CheckboxFilterGroup' }

export const defaults = () => (
  <SearchResultsContext.Provider value={{ pageData: { filters: [] }, actions: {} }}>
    <CheckboxFilterGroup group={{ options: [{ name: 'red', matches: 2 }] }} />
    <CheckboxFilterGroup group={{ options: [{ name: 'blue', matches: 1 }] }} />
    <CheckboxFilterGroup group={{ options: [{ name: 'green', matches: 3 }] }} />
  </SearchResultsContext.Provider>
)
