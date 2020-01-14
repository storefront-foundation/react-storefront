import React, { useState, useEffect, useContext } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { Button } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

export const styles = theme => ({
  root: {
    '.rsf-po-selected &': {
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,

      '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      },
    },
  },
})

const useStyles = makeStyles(styles, { name: 'RSFTextProductOption' })

/**
 * Represents a single product option value as a button with text. All additional
 * props are spread to the underlying Material UI Button component.
 *
 * Example:
 *
 * ```js
 * <TextProductOption label="SM" selected/>
 * ```
 */
export default function TextProductOption({
  classes,
  className,
  selected,
  label,
  skeleton,
  buttonProps,
  onClick,
}) {
  classes = useStyles({ classes })

  if (skeleton) {
    return <Skeleton className={className} width={64} height={36} />
  }

  return (
    <Button
      {...buttonProps}
      className={clsx(className, classes.root)}
      variant={selected ? 'contained' : 'outlined'}
      color={selected ? 'primary' : 'default'}
      onClick={onClick}
    >
      {label}
    </Button>
  )
}

TextProductOption.propTypes = {
  /**
   * Set to true to display a skeleton instead of the actual button
   */
  skeleton: PropTypes.bool,
  /**
   * The text for the button
   */
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  /**
   * Set to `true` to mark the option as selected.
   */
  selected: PropTypes.bool,
  /**
   * This prop is intentionally ignored so that TextProductOption can be used interchangably with
   * SwatchProductOption without displaying a warning.
   */
  imageProps: PropTypes.object,
}

TextProductOption.defaultProps = {
  selected: false,
}
