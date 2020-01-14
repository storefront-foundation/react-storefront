import useTheme from '@material-ui/core/styles/useTheme'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import { Dialog, DialogActions, DialogContent, IconButton, Zoom } from '@material-ui/core'

const Transition = React.forwardRef((props, ref) => {
  return <Zoom duration={500} ref={ref} {...props} />
})

const styles = theme => ({
  root: {},
  content: {
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  paper: {
    flex: 1,
    background: 'rgba(255,255,255,0.9)',
  },
})

const useStyles = makeStyles(styles, { name: 'RSFLightbox' })

function Lightbox(props) {
  let { classes, children, onClose, open, TransitionComponent } = props
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

Lightbox.defaultProps = {
  TransitionComponent: Transition,
}

export default React.memo(Lightbox)
