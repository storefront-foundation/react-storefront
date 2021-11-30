import React, { memo, forwardRef, useContext } from 'react'
import { makeStyles } from '@mui/material/styles'
import { Button, MenuItem } from '@mui/material'
import PropTypes from 'prop-types'
import SearchResultsContext from './SearchResultsContext'

export const styles = theme => ({
  /**
   * Styles applied to the root container if [`variant`](#prop-variant) is `'buttons'`.
   */
  container: {
    padding: '15px 0 0 15px',
  },
  /**
   * Styles applied to each option if [`variant`](#prop-variant) is `'buttons'`.
   */
  option: {
    boxShadow: 'none',
    width: 'calc(50% - 15px)',
    margin: '0 15px 15px 0',
  },
})

const useStyles = makeStyles(styles, { name: 'RSFSort' })

/**
 * UI for sorting a list of products.  This component can be used on its own, or you can use
 * [`SortButton`](/apiReference/plp/SortButton) to automatically display this component in a drawer
 * that slides up from the bottom of the viewport.
 */
function Sort({ variant, classes, onSelect }) {
  classes = useStyles({ classes })

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
            color={sort === option.code ? 'primary' : 'default'}
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
  } else if (variant === 'menu-items') {
    return renderMenu()
  } else {
    return null
  }
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

export default memo(forwardRef((props, ref) => <Sort {...props} />))
