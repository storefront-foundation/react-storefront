import React from 'react'
import clsx from 'clsx'
import { Vbox } from '../Box'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Check as CheckedIcon } from '@material-ui/icons'
import Image from '../Image'
import PropTypes from 'prop-types'
import { Skeleton } from '@material-ui/lab'

export const styles = theme => ({
  root: {},
  button: {
    position: 'relative',
    marginBottom: theme.spacing(0.5),
    padding: 2,
    borderRadius: '50%',
    backgroundColor: 'transparent',
    minWidth: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.grey[500],
    cursor: 'pointer',
    '&:focus': {
      outline: 0,
    },
  },
  image: {
    height: '100%',
    width: '100%',
    borderRadius: '50%',
  },
  '@media (hover: none)': {
    SwatchButton: {
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
  },
  checkMark: {
    transition: 'opacity 0.1s linear',
    opacity: 0,
    position: 'absolute',
    zIndex: 1,
    color: 'white',
    top: 2,
    left: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 2,
    height: 'calc(100% - 4px)',
    width: 'calc(100% - 4px)',
    boxSizing: 'border-box',
    borderRadius: '50%',
    '.rsf-po-selected &': {
      opacity: 1,
    },
  },
  selected: {
    opacity: 1,
  },
  selectedLabel: {
    fontWeight: 'bold',
  },
  default: {
    height: 48,
    width: 48,
    '& svg': {
      height: 24,
      width: 24,
    },
  },
  small: {
    height: 32,
    width: 32,
    '& svg': {
      height: 16,
      width: 16,
    },
  },
  tiny: {
    height: 24,
    width: 24,
    '& svg': {
      height: 12,
      width: 12,
    },
  },
})
const useStyles = makeStyles(styles, { name: 'RSFSwatchProductOption' })

export default function SwatchProductOption({
  selected,
  label,
  classes,
  imageProps,
  onClick,
  SelectedIcon,
  size,
  skeleton,
  ImageComponent,
  className,
  buttonProps,
}) {
  classes = useStyles({ classes })

  if (skeleton) {
    return (
      <Skeleton
        variant="circle"
        style={{ marginTop: 0, marginBottom: 4, margintLeft: 4, marginRight: 4 }}
        className={clsx({
          [buttonProps.className]: true,
          [classes[size]]: true,
        })}
      />
    )
  }

  return (
    <Vbox className={classes.root}>
      <button
        {...buttonProps}
        type="button"
        onClick={onClick}
        className={clsx({
          [className]: className != null,
          [classes.button]: true,
          [classes[size]]: true,
        })}
      >
        <div
          className={clsx({
            [classes.checkMark]: true,
            [classes.selected]: selected,
          })}
        >
          <SelectedIcon className={classes.icon} />
        </div>
        <ImageComponent classes={{ image: classes.image }} fill aspectRatio={1} {...imageProps} />
      </button>
      {label && (
        <Typography variant="caption" className={clsx({ [classes.selectedLabel]: selected })}>
          {label}
        </Typography>
      )}
    </Vbox>
  )
}

SwatchProductOption.propTypes = {
  /**
   * Text to display below the button
   */
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  /**
   * Props for the `Image` element
   */
  imageProps: PropTypes.shape(Image.propTypes),
  /**
   * Controls the size of the button
   */
  size: PropTypes.oneOf(['default', 'small', 'tiny']),
  /**
   * The component to use to display images
   */
  ImageComponent: PropTypes.elementType,
}

SwatchProductOption.defaultProps = {
  imageProps: {},
  SelectedIcon: CheckedIcon,
  ImageComponent: Image,
  size: 'default',
  buttonProps: {},
}
