import React, { useContext } from 'react'
import { styled } from '@mui/material/styles';
import SearchSuggestionGroup from './SearchSuggestionGroup'
import SearchContext from './SearchContext'
import LoadMask from '../LoadMask'
import PropTypes from 'prop-types'

const PREFIX = 'RSFSearchSuggestions';

const classes = {
  root: `${PREFIX}-root`,
  group: `${PREFIX}-group`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  /**
   * Styles applied to the root element.
   */
  [`& .${classes.root}`]: {
    flex: 1,
    position: 'relative',
    overflowY: 'auto',
  },

  /**
   * Styles applied to each of the group wrapper elements.
   */
  [`& .${classes.group}`]: {
    margin: theme.spacing(0, 0, 2, 0),
  }
}));

export {};

export default function SearchSuggestions({  render }) {

  const { state } = useContext(SearchContext)

  return (
    (<Root>
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
    </Root>)
  );
}

SearchSuggestions.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,
}

SearchSuggestions.defaultProps = {}
