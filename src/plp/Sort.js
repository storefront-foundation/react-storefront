import React, { memo, useContext } from 'react'
import { styled } from '@mui/material/styles'
import { Button, MenuItem } from '@mui/material'
import PropTypes from 'prop-types'
import SearchResultsContext from './SearchResultsContext'

const PREFIX = 'RSFSort'

const defaultClasses = {
  container: `${PREFIX}-container`,
  option: `${PREFIX}-option`,
}

const StyledSort = styled(Sort)(() => ({
  /**
   * Styles applied to the root container if [`variant`](#prop-variant) is `'buttons'`.
   */
  [`& .${defaultClasses.container}`]: {
    padding: '15px 0 0 15px',
  },

  /**
   * Styles applied to each option if [`variant`](#prop-variant) is `'buttons'`.
   */
  [`& .${defaultClasses.option}`]: {
    boxShadow: 'none',
    width: 'calc(50% - 15px)',
    margin: '0 15px 15px 0',
  },
}))

export {}

/**
 * UI for sorting a list of products.  This component can be used on its own, or you can use
 * [`SortButton`](/apiReference/plp/SortButton) to automatically display this component in a drawer
 * that slides up from the bottom of the viewport.
 */
var Sort = function({ variant, classes: c = {}, onSelect }) {
  const classes = { ...defaultClasses, ...c }

  const {
    pageData: { sort, sortOptions },
    actions: { setSort },
  } = useContext(SearchResultsContext)

  const handleClick = (option, e) => {
    onSelect(option, e)

    if (!e.defaultPrevented) {
      setSort(option)
    }
  }

  const renderButtons = () => (
    <div className={classes.container}>
      {sortOptions &&
        sortOptions.map((option, i) => (
          <Button
            className={classes.option}
            color={sort === option.code ? 'primary' : 'secondary'}
            variant="contained"
            onClick={e => handleClick(option, e)}
            key={i}
          >
            {option.name}
          </Button>
        ))}
    </div>
  )

  const renderMenu = () => (
    <>
      {sortOptions &&
        sortOptions.map((option, i) => (
          <MenuItem key={i} onClick={e => handleClick(option, e)}>
            {option.name}
          </MenuItem>
        ))}
    </>
  )

  if (variant === 'buttons') {
    return renderButtons()
  }
  if (variant === 'menu-items') {
    return renderMenu()
  }
  return null
}

Sort.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * A function to call when a sort option is selected.  The option and event are passed.
   * The default behavior can be prevented by called `preventDefault()` on the passed in event.
   */
  onSelect: PropTypes.func,

  /**
   * Controls how sort options are displayed.
   */
  variant: PropTypes.oneOf(['menu-items', 'buttons']),
}

Sort.defaultProps = {
  onSelect: Function.prototype,
  variant: 'buttons',
}

export default memo(StyledSort)
