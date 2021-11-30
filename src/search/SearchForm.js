import PropTypes from 'prop-types'
import React, { useRef } from 'react'
import makeStyles from '@mui/material/styles/makeStyles'
import { useRouter } from 'next/router'
import qs from 'qs'

export const styles = theme => ({
  /**
   * Styles applied to the root element.
   */
  root: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
})
const useStyles = makeStyles(styles, { name: 'RSFSearchForm' })

/**
 * A form used to submit a search query.
 */
export default function SearchForm({ classes, children, action, autoComplete }) {
  classes = useStyles({ classes })

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
    <form
      ref={ref}
      action={action}
      onSubmit={handleSubmit}
      className={classes.root}
      target="_top"
      autoComplete={autoComplete ? 'on' : 'off'}
    >
      {children}
    </form>
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
