import React, { useCallback } from 'react'
import clsx from 'clsx'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { IconButton } from '@material-ui/core'
import { ChevronLeft, ChevronRight } from '@material-ui/icons'

export const styles = theme => ({
  arrow: {
    position: 'absolute',
    top: '50%',
    marginTop: '-24px',
  },

  leftArrow: {
    left: 0,
  },

  rightArrow: {
    right: 0,
  },
})

const useStyles = makeStyles(styles, { name: 'RSFCarouselArrows' })

export default function CarouselArrows({ className, classes, selected, count, setSelected, show }) {
  classes = useStyles({ classes })

  const createOnClickArrow = useCallback(
    idxChange => evt => {
      evt.preventDefault()
      setSelected(selected + idxChange)
    },
    [selected, setSelected],
  )

  return (
    <div className={clsx(classes.arrows, className)}>
      {selected !== 0 && (
        <IconButton
          className={clsx(classes.arrow, classes.leftArrow)}
          onClick={createOnClickArrow(-1)}
        >
          <ChevronLeft classes={{ root: classes.icon }} />
        </IconButton>
      )}
      {selected !== count - 1 && (
        <IconButton
          className={clsx(classes.arrow, classes.rightArrow)}
          onClick={createOnClickArrow(1)}
        >
          <ChevronRight classes={{ root: classes.icon }} />
        </IconButton>
      )}
    </div>
  )
}

CarouselArrows.propTypes = {}

CarouselArrows.defaultProps = {}
