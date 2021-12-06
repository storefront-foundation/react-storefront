import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'
import React, { useRef } from 'react'
import { useRouter } from 'next/router'
import qs from 'qs'

const PREFIX = 'RSFSearchForm'

const defaultClasses = {
  root: `${PREFIX}-root`,
}

const Root = styled('form')(({ theme }) => ({
  /**
   * Styles applied to the root element.
   */
  [`&.${defaultClasses.root}`]: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
}))

export {}

/**
 * A form used to submit a search query.
 */
export default function SearchForm({ classes: c = {}, children, action, autoComplete }) {
  const classes = { ...defaultClasses, ...c }
  const ref = useRef()
  const router = useRouter()

  const handleSubmit = async e => {
    e.preventDefault()

    const data = new FormData(ref.current)
    const query = {}

    for (let [name, value] of data.entries()) {
      query[name] = value
    }

    const url = `${action}${action.includes('?') ? '&' : '?'}${qs.stringify(query)}`
    router.push(action.split(/\?/)[0], url)
    return false
  }

  return (
    <Root
      ref={ref}
      action={action}
      onSubmit={handleSubmit}
      className={classes.root}
      target="_top"
      autoComplete={autoComplete ? 'on' : 'off'}
    >
      {children}
    </Root>
  )
}

SearchForm.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * Children to be rendered inside the form.
   */
  children: PropTypes.node,

  /**
   * An `action` attribute to use for the `<form>` element.
   */
  action: PropTypes.string,

  /**
   * Form auto complete
   */
  autoComplete: PropTypes.bool,
}

SearchForm.defaultProps = {
  action: '/search',
  autoComplete: false,
}
