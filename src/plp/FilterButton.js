import React, { useState, useCallback, memo, useContext } from 'react'
import ActionButton from '../ActionButton'
import SearchResultsContext from './SearchResultsContext'
import Filter from './Filter'
import PropTypes from 'prop-types'
import Drawer from '../drawer/Drawer'
import { makeStyles } from '@mui/material/styles'
import { useRouter } from 'next/router'

export const styles = theme => ({
  /**
   * Styles applied to the drawer element.
   */
  drawer: {
    height: '75vh',
  },
})

const useStyles = makeStyles(styles, { name: 'RSFFilterButton' })

/**
 * A button that when clicked, opens a drawer containing the `Filter` view. Current filters
 * are displayed in the button text.
 */
function FilterButton({ classes, title, drawerProps, onClick, href, ...props }) {
  classes = useStyles({ classes })

  const {
    pageData: { filters, facets },
    actions,
  } = useContext(SearchResultsContext)

  const openFilter = useRouter().query.openFilter === '1'
  const [state, setState] = useState({ open: openFilter, mountDrawer: openFilter })
  const { open, mountDrawer } = state
  const { clear, clearDisabled, drawer, ...buttonClasses } = useStyles(classes)

  const toggleOpen = open => {
    setState({ ...state, open, mountDrawer: mountDrawer || true })
  }

  const handleClick = e => {
    if (onClick) {
      onClick(e)
    }

    if (!e.defaultPrevented) {
      toggleOpen(true)
    }
  }

  const handleViewResultsClick = useCallback(() => {
    toggleOpen(false)
    actions.applyFilters()
  }, [actions])

  const getFilterList = () => {
    if (!filters || !facets || filters.length === 0) return null
    if (filters.length > 1) return `${filters.length} selected`

    const selected = filters[0]

    for (let group of facets) {
      for (let option of group.options) {
        if (selected === option.code) {
          return option.name
        }
      }
    }

    return null
  }

  return (
    <>
      <ActionButton
        label={title}
        href={href}
        value={getFilterList()}
        classes={buttonClasses}
        onClick={handleClick}
        {...props}
      />
      {!href && (
        <Drawer
          classes={{ paper: classes.drawer }}
          anchor="bottom"
          open={open}
          onClose={toggleOpen.bind(null, false)}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {mountDrawer && <Filter onViewResultsClick={handleViewResultsClick} {...drawerProps} />}
        </Drawer>
      )}
    </>
  )
}

FilterButton.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * Props for the underlying `Filter` component.
   */
  drawerProps: PropTypes.object,

  /**
   * The label for the button and the drawer header.
   */
  title: PropTypes.string,

  /**
   * When specified, clicking the button will navigate to the specified URL with a full page reload.
   */
  href: PropTypes.string,

  /**
   * A function that will be called when the button is clicked.
   */
  onClick: PropTypes.func,
}

FilterButton.defaultProps = {
  title: 'Filter',
  drawerProps: {},
}

export default memo(FilterButton)
