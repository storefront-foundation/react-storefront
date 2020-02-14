import PropTypes from 'prop-types'
import React, { useMemo, useContext } from 'react'
import SearchResultsContext from './SearchResultsContext'
import { makeStyles } from '@material-ui/core/styles'
import SwatchProductOption from '../option/SwatchProductOption'
import TextProductOption from '../option/TextProductOption'
import { Hbox } from '../Box'

const styles = theme => ({
  /**
   * Styles applied to the root element.
   */
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  /**
   * Styles applied to the matching text.
   */
  matches: {
    display: 'inline',
    ...theme.typography.caption,
    marginLeft: 2,
    color: theme.palette.grey[700],
  },
  /**
   * Styles applied to each button element.
   */
  button: {
    fontWeight: 'normal',
    margin: theme.spacing(0, 0.5, 0.5, 0),
  },
})

const useStyles = makeStyles(styles, { name: 'RSFButtonFilterGroup' })

/**
 * A UI for grouping filters using buttons.
 */
export default function ButtonFilterGroup(props) {
  const { group, submitOnChange } = props
  const {
    pageData: { filters },
    actions: { toggleFilter },
  } = useContext(SearchResultsContext)

  const classes = useStyles(props.classes)

  return useMemo(
    () => (
      <div className={classes.root}>
        {group.options.map((facet, i) => {
          const selected = filters.indexOf(facet.code) !== -1
          const { image, matches, name } = facet
          const handleClick = () => toggleFilter(facet, submitOnChange)
          const Variant = image ? SwatchProductOption : TextProductOption

          return (
            <Variant
              key={i}
              classes={{ root: classes.button }}
              selected={selected}
              onClick={handleClick}
              label={
                <Hbox>
                  <span>{name}</span>
                  {matches ? <span className={classes.matches}>({matches})</span> : null}
                </Hbox>
              }
              {...(image ? { imageProps: facet.image } : undefined)}
            />
          )
        })}
      </div>
    ),
    [filters, ...Object.values(props)],
  )
}

ButtonFilterGroup.propTypes = {
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
        matches: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        image: PropTypes.object,
      }),
    ),
  }),
  /**
   * Set to `true` to refresh the results when the user toggles a filter.
   */
  submitOnChange: PropTypes.bool,
}
