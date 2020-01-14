import React, { useRef, useState } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { useRouter } from 'next/router'
import qs from 'qs'

export const styles = theme => ({
  root: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
})
const useStyles = makeStyles(styles, { name: 'RSFSearchForm' })

export default function SearchForm({ classes, children, action }) {
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
    <form ref={ref} action={action} onSubmit={handleSubmit} className={classes.root} target="_top">
      {children}
    </form>
  )
}

SearchForm.propTypes = {}

SearchForm.defaultProps = {
  action: '/search',
}
