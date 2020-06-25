import React from 'react'
import { Typography } from '@material-ui/core'

const escapeHtml = unsafe =>
  unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const addHighlight = (query, text, className) =>
  escapeHtml(text).replace(
    new RegExp(query, 'gi'),
    match => `<span class="${className}">${match}</span>`,
  )

function Highlight({ query, text, highlightClassName, ...props }) {
  return (
    <Typography
      {...props}
      dangerouslySetInnerHTML={{ __html: addHighlight(query, text, highlightClassName) }}
    />
  )
}

Highlight.defaultProps = {
  highlightClassName: 'highlight',
}

export default Highlight
