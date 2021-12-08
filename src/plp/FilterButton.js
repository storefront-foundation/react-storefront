import React, { useState, useCallback, memo, useContext } from 'react'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import ActionButton from '../ActionButton'
import SearchResultsContext from './SearchResultsContext'
import Filter from './Filter'
import Drawer from '../drawer/Drawer'

const PREFIX = 'RSFFilterButton'

const defaultClasses = {
  drawer: `${PREFIX}-drawer`,
}

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(() => ({
  /**
   * Styles applied to the drawer element.
   */
  [`& .${defaultClasses.drawer}`]: {
    height: '75vh',
  },
}))

export {}

/**
 * A button that when clicked, opens a drawer containing the `Filter` view. Current filters
 * are displayed in the button text.
 */
const FilterButton = function({ classes: c = {}, title, drawerProps, onClick, href, ...props }) {
  const classes = { ...defaultClasses, ...c }
  const { drawer, ...buttonClasses } = classes
  const {
    pageData: { filters, facets },
    actions,
  } = useContext(SearchResultsContext)

  const openFilter = useRouter().query.openFilter === '1'
  const [state, setState] = useState({ open: openFilter, mountDrawer: openFilter })
  const { open, mountDrawer } = state

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

    for (const group of facets) {
      for (const option of group.options) {
        if (selected === option.code) {
          return option.name
        }
      }
    }

    return null
  }

  return (
    <Root>
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
          classes={{ paper: drawer }}
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
    </Root>
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
