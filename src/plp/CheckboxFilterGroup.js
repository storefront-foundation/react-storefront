import PropTypes from 'prop-types'
import React, { useMemo, useContext } from 'react'
import { Checkbox, FormGroup, Typography, FormControlLabel } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import SearchResultsContext from './SearchResultsContext'

const styles = theme => ({
  /**
   * Styles applied to the matching text.
   */
  matches: {
    marginLeft: '5px',
    display: 'inline',
  },
  /**
   * Styles applied to the group label element.
   */
  groupLabel: {
    display: 'flex',
    alignItems: 'center',
  },
})

const useStyles = makeStyles(styles, { name: 'RSFCheckboxFilterGroup' })

/**
 * A UI for grouping filters using checkboxes.
 */
export default function CheckboxFilterGroup(props) {
  const { group, submitOnChange } = props
  const {
    pageData: { filters },
    actions: { toggleFilter },
  } = useContext(SearchResultsContext)

  const classes = useStyles(props.classes)

  return useMemo(
    () => (
      <FormGroup>
        {group.options.map((facet, i) => (
          <FormControlLabel
            key={i}
            label={
              <div className={classes.groupLabel}>
                <span>{facet.name}</span>
                <Typography variant="caption" className={classes.matches} component="span">
                  ({facet.matches})
                </Typography>
              </div>
            }
            control={
              <Checkbox
                checked={filters.indexOf(facet.code) !== -1}
                color="primary"
                onChange={() => toggleFilter(facet, submitOnChange)}
              />
            }
          />
        ))}
      </FormGroup>
    ),
    [...Object.values(props), filters],
  )
}

CheckboxFilterGroup.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,
  /**
   * Contains data for the group to be rendered.
   */
  group: PropTypes.shape({
    options: PropTypes.arrayOf(
      PropTypes.shape({
        code: PropTypes.string,
        name: PropTypes.string,
        matches: PropTypes.string,
        image: PropTypes.object,
      }),
    ),
  }),
  /**
   * Function called when the filter changes are submitted
   */
  submitOnChange: PropTypes.func,
}
