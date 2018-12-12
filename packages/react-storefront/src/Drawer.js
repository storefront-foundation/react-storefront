/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import ResizeObserver from 'resize-observer-polyfill'
import MUIDrawer from '@material-ui/core/Drawer'
import { withStyles } from '@material-ui/core/styles';
import Close from '@material-ui/icons/Close'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { inject } from 'mobx-react'
import classnames from 'classnames'

/**
 * A slide-in drawer with fab close button.
 */
export const styles = theme => ({
  closeButton: {
    position: 'absolute',
    right: '10px',
    top: '-28px',
    zIndex: 1
  },

  paper: {
    overflowY: 'visible'
  },

  title: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '18px',
    borderBottom: `1px solid ${theme.palette.divider}`
  },

  ampClosed: {
    display: 'none'
  }
});

@withStyles(styles, { name: 'RSFDrawer' })
@inject(({ app, ampStateId }) => ({ amp: app && app.amp, ampStateId }))
export default class Drawer extends Component {

  static propTypes = {
    /**
     * Set to false to hide the close button. Defaults to true
     */
    showCloseButton: PropTypes.bool,

    /**
     * Called when the user closes the drawer
     */
    onRequestClose: PropTypes.func.isRequired,

    /**
     * The title to display at the top of the drawer
     */
    title: PropTypes.oneOfType([ PropTypes.string, PropTypes.element ]),

    /**
     * Set to true to automatically add padding to the body when the drawer
     * is open so that the user is able to scroll and see all of the body content.
     * Defaults to false.
     */
    autoAdjustBodyPadding: PropTypes.bool,

    /**
     * Props to apply to the closeButton
     */
    closeButtonProps: PropTypes.object,

    /**
     * The name of a property the amp-state to bind to the closed state of the drawer.
     */
    ampBindClosed: PropTypes.string
  }

  static defaultProps = {
    showCloseButton: true,
    autoAdjustBodyPadding: false,
    closeButtonProps: {}
  }

  constructor() {
    super();
    this.drawer = React.createRef()
  }

  render() {
    const { amp, ampStateId, ampBindClosed, variant, closeButtonProps, showCloseButton, open, onRequestClose, title, children, classes, autoAdjustBodyPadding, ...rest } = this.props

    return (
      <MUIDrawer 
        anchor="bottom" 
        classes={{
          paper: classnames({
            [classes.paper]: true,
            [classes.ampClosed]: amp && !open
          })
        }}
        amp-bind={ampBindClosed ? `class=>${ampStateId}.${ampBindClosed} ? '${classes.ampClosed}' : null` : null} 
        open={(amp && variant === "temporary") || open}
        variant={variant}
        {...rest}
      >
        <div ref={this.drawer}>
          { title && (
            <div className={classes.title}>
              <Typography variant="h6" component="div">{title}</Typography>
            </div>
          )}

          { showCloseButton && (
            <Button 
              variant="fab" 
              color="primary" 
              className={classes.closeButton} 
              onClick={this.closeDrawer} 
              style={{ display: open ? '' : 'none' }}
              on={ampBindClosed ? `tap:AMP.setState({ ${ampStateId}: { ${ampBindClosed}: true }})` : null}
              {...closeButtonProps}
            >
              <Close/>
            </Button>
          )}

          { children }
        </div>
      </MUIDrawer>
    )
  }

  // add body padding equal to drawer height
  componentDidMount() {
    this.setPadding()
    const el = this.drawer.current

    if (this.props.autoAdjustBodyPadding && el) {
      this.drawerResize = new ResizeObserver(() => {
        document.body.style.paddingBottom = el && el.clientHeight + 'px'
      })

      this.drawerResize.observe(el)
    }
  }

  componentWillUnmount() {
    const el = this.drawer.current

    if (this.drawerResize && el) {
      this.drawerResize.unobserve(el)
    }
  }

  // if value of open property changes, recalcuate drawer height/body padding
  componentWillReceiveProps(nextProps) {
    if (nextProps.open && !this.props.open) {
        this.setPadding()
    } else if (this.props.open && !nextProps.open) {
        this.closeDrawer()
    }
  }

  setPadding() {
    if (this.props.autoAdjustBodyPadding) {
      requestAnimationFrame(() => {
        const el = this.drawer.current
        document.body.style.paddingBottom = el && el.clientHeight + 'px'
      })
    }
  }

  closeDrawer = () => {
    const { onRequestClose } = this.props
    onRequestClose()
    document.body.style.paddingBottom = 0
  }

}
