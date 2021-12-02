import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles';
import React, { useMemo, useContext } from 'react'
import SearchResultsContext from './SearchResultsContext'
import ExpandableSection from '../ExpandableSection'
import CheckboxFilterGroup from './CheckboxFilterGroup'
import ButtonFilterGroup from './ButtonFilterGroup'
import ListItem from '@mui/material/ListItem'

const PREFIX = 'RSFFacetGroup';

const classes = {
  groupTitle: `${PREFIX}-groupTitle`
};

const StyledExpandableSection = styled(ExpandableSection)((
  {
    theme
  }
) => ({
  /**
   * Styles applied to the group's title element.
   */
  [`& .${classes.groupTitle}`]: {
    [theme.breakpoints.up('sm')]: {
      fontWeight: 'bold',
    },
  }
}));

/**
 * A grouping of facets used for filtering products.
 */
export default function FacetGroup(props) {
  const {
    group,
    submitOnChange,
    defaultExpanded,
    ControlsComponent,
    controlsProps,
    listItemProps,
    onClose,
    isSimpleList,
  } = props

  const {
    pageData: { filters },
  } = useContext(SearchResultsContext)

  return useMemo(() => {
    if (!filters) return null

    const selection = []

    for (let option of group.options) {
      if (filters.indexOf(option.code) !== -1) {
        selection.push(option)
      }
    }

    let Controls = ControlsComponent

    if (!Controls && group.ui === 'buttons') {
      Controls = ButtonFilterGroup
    } else if (!Controls) {
      Controls = CheckboxFilterGroup
    }

    let caption = null

    if (selection.length === 1) {
      caption = selection[0].name
    } else if (selection.length > 0) {
      caption = `${selection.length} selected`
    }

    if (isSimpleList) {
      return (
        <ListItem {...listItemProps}>
          <span className={classes.groupTitle}>{group.name}</span>
          <Controls
            onClose={onClose}
            group={group}
            submitOnChange={submitOnChange}
            {...controlsProps}
          />
        </ListItem>
      )
    }

    return (
      <StyledExpandableSection
        title={group.name}
        caption={caption}
        defaultExpanded={defaultExpanded}
        classes={{ title: classes.groupTitle }}
      >
        <Controls group={group} submitOnChange={submitOnChange} {...controlsProps} />
      </StyledExpandableSection>
    );
  }, [...Object.values(props), filters]);
}

FacetGroup.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,
  // TODO - make this a shape
  /**
   * Contains data for the facet group to be rendered.
   */
  group: PropTypes.object,
  /**
   * Set to `true` to refresh the results when the user toggles a filter.
   */
  submitOnChange: PropTypes.bool,
  /**
   * If `true`, the group is expanded by default.
   */
  defaultExpanded: PropTypes.bool,
  /**
   * Custom component to use own component.
   */
  ControlsComponent: PropTypes.func,
  controlsProps: PropTypes.object,
  onClose: PropTypes.func,
  listItemProps: PropTypes.object,
  /**
   * If `true` list will be displayed instead of expandable items.
   */
  isSimpleList: PropTypes.bool,
}
