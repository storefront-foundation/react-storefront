import useTheme from '@material-ui/core/styles/useTheme'
import PropTypes from 'prop-types'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import { Dialog, DialogActions, DialogContent, IconButton, Zoom } from '@material-ui/core'

const Transition = React.forwardRef((props, ref) => {
  return <Zoom duration={500} ref={ref} {...props} />
})

const styles = theme => ({
  /**
   * Styles applied to the root element.
   */
  root: {},

  /**
   * Styles applied to the content element of the modal.
   */
  content: {
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
  },

  /**
   * Styles passed through to the `paper` CSS rule of the [`Dialog`](https://material-ui.com/api/dialog/#css)
   * root element.
   */
  paper: {
    flex: 1,
    background: 'rgba(255,255,255,0.9)',
  },
})

const useStyles = makeStyles(styles, { name: 'RSFLightbox' })

/**
 * A modal that opens to give a full-screen view of the elements within a
 * [`Carousel`](/apiReference/carousel/Carousel).
 */
function Lightbox({ classes, children, onClose, open, TransitionComponent }) {
  classes = useStyles({ classes })
  const theme = useTheme()

  return (
    <Dialog
      open={open}
      fullScreen
      classes={{
        paper: classes.paper,
      }}
      TransitionComponent={TransitionComponent}
      className={classes.root}
      style={{ zIndex: theme.zIndex.modal + 10 }}
    >
      <DialogActions>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogActions>
      <DialogContent className={classes.content}>{children}</DialogContent>
    </Dialog>
  )
}

Lightbox.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * Child nodes to show inside the Lightbox.
   */
  children: PropTypes.node.isRequired,

  /**
   * A function to call when the Lightbox is closed.
   */
  onClose: PropTypes.func,

  /**
   * If `true`, the Lightbox is open.
   */
  open: PropTypes.bool.isRequired,

  /**
   * The component used for the [transition](https://material-ui.com/components/transitions/#transitioncomponent-prop).
   */
  TransitionComponent: PropTypes.elementType,
}

Lightbox.defaultProps = {
  TransitionComponent: Transition,
}

export default React.memo(Lightbox)
