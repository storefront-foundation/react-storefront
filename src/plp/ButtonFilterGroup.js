import React, { useMemo, useContext } from 'react'
import SearchResultsContext from './SearchResultsContext'
import { makeStyles } from '@material-ui/core/styles'
import SwatchProductOption from '../option/SwatchProductOption'
import TextProductOption from '../option/TextProductOption'
import { Hbox } from '../Box'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  wrap: {
    margin: theme.spacing(0, 1, 1, 0),
  },
  matches: {
    display: 'inline',
    ...theme.typography.caption,
    marginLeft: 2,
    color: theme.palette.grey[700],
  },
  button: {
    fontWeight: 'normal',
    margin: theme.spacing(0, 0.5, 0.5, 0),
  },
})

const useStyles = makeStyles(styles, { name: 'RSFButtonFilterGroup' })

export default function ButtonFilterGroup(props) {
  const { group, submitOnChange } = props
  const {
    pageData: { filters },
    actions: { toggleFilter },
  } = useContext(SearchResultsContext)

  const classes = useStyles()

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
