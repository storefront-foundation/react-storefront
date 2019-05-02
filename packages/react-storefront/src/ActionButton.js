/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

export const styles = theme => ({
  raised: {
    boxShadow: 'none',
    backgroundColor: '#F4F2F1'
  },
  label: {
    justifyContent: 'space-between',
    alignItems: 'baseline',
    textTransform: 'none'
  },
  caption: {
    textTransform: 'none',
    fontWeight: 'bold'
  },
  value: {
    color: theme.palette.text.primary,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipses',
    marginLeft: '10px'
  }
})

/**
 * This button class displays a label and value
 */
function ActionButton({ label, value, children, classes, ...props }) {
  const { caption: captionClass, value: valueClass, ...otherClasses } = classes

  return (
    <Button variant="contained" classes={otherClasses} {...props}>
      <Typography variant="button" className={captionClass}>
        {label}
      </Typography>
      <Typography variant="caption" className={valueClass}>
        {value}
      </Typography>
    </Button>
  )
}

ActionButton.propTypes = {
  /**
   * The label to display on the left side of the button
   */
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

  /**
   * The value to display on the right side of the button
   */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
}

export default withStyles(styles, { name: 'RSFActionButton' })(ActionButton)
