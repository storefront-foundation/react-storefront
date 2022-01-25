import React, { useContext } from 'react'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'
import SearchSuggestionGroup from './SearchSuggestionGroup'
import SearchContext from './SearchContext'
import LoadMask from '../LoadMask'

const PREFIX = 'RSFSearchSuggestions'

const defaultClasses = {
  root: `${PREFIX}-root`,
  group: `${PREFIX}-group`,
}

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
  /**
   * Styles applied to the root element.
   */
  [`& .${defaultClasses.root}`]: {
    flex: 1,
    position: 'relative',
    overflowY: 'auto',
  },

  /**
   * Styles applied to each of the group wrapper elements.
   */
  [`& .${defaultClasses.group}`]: {
    margin: theme.spacing(0, 0, 2, 0),
  },
}))

export {}

export default function SearchSuggestions({ render, classes: c = {} }) {
  const classes = { ...defaultClasses, ...c }
  const { state } = useContext(SearchContext)

  return (
    <Root>
      <LoadMask show={state.loading} transparent />
      <div className={classes.root}>
        {render
          ? render(state)
          : state.groups &&
            state.groups.map(group => (
              <div key={group.caption} className={classes.group}>
                <SearchSuggestionGroup {...group} />
              </div>
            ))}
      </div>
    </Root>
  )
}

SearchSuggestions.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,
  render: PropTypes.func,
}

SearchSuggestions.defaultProps = {}
