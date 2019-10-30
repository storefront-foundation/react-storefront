/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper'
import Close from '@material-ui/icons/Close'
import Fab from '@material-ui/core/Fab'
import classnames from 'classnames'
import { Helmet } from 'react-helmet'
import withStyleProps from '../withStyleProps'

const animationByAnchor = {
  top: 'fly-in-top',
  bottom: 'fly-in-bottom'
}

export const styles = ({ theme, anchor }) => ({
  backdrop: {
    top: '0',
    left: '0',
    right: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    bottom: '0',
    position: 'fixed',
    display: 'block',
    zIndex: theme.zIndex.amp.modal + 1
  },

  closeButton: {
    position: 'absolute',
    right: '10px',
    top: '-28px',
    zIndex: 1
  },

  hidden: {
    display: 'none'
  },

  lightbox: {
    zIndex: theme.zIndex.amp.modal + 2
  },

  container: {
    width: '100%',
    boxSizing: 'border-box',
    flexWrap: 'nowrap',
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    boxShadow:
      '0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)',
    [anchor]: 0
  },

  sidebar: {
    backgroundColor: 'white',
    boxShadow:
      '0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)',
    '& ~ div[class*="amphtml-sidebar-mask"]': {
      display: 'none'
    }
  }
})

@withStyleProps(styles, { name: 'RSFAmpDrawer' })
export default class AmpDrawer extends Component {
  render() {
    const {
      classes,
      children,
      ampStateId,
      anchor = 'bottom',
      showCloseButton = anchor === 'bottom',
      closeButtonProps
    } = this.props
    if (anchor === 'left' || anchor === 'right') {
      return (
        <React.Fragment>
          <Helmet>
            <script
              async
              custom-element="amp-sidebar"
              src="https://cdn.ampproject.org/v0/amp-sidebar-0.1.js"
            />
          </Helmet>
          <div
            className={classes.hidden}
            on={`tap:${ampStateId}.close`}
            amp-bind={`class=>${ampStateId}.open ? "${classnames(classes.backdrop)}" : "${
              classes.hidden
            }"`}
          >
            <amp-sidebar
              class={classes.sidebar}
              id={ampStateId}
              layout="nodisplay"
              side={anchor}
              on={`sidebarClose:AMP.setState({ ${ampStateId}: { open: false } })`}
            >
              {children}
            </amp-sidebar>
          </div>
        </React.Fragment>
      )
    }
    return (
      <React.Fragment>
        <Helmet>
          <script
            async
            custom-element="amp-lightbox"
            src="https://cdn.ampproject.org/v0/amp-lightbox-0.1.js"
          />
        </Helmet>
        <div
          className={classes.hidden}
          on={`tap:AMP.setState({ ${ampStateId}: { open: false }})`}
          amp-bind={`class=>${ampStateId}.open ? "${classnames(classes.backdrop)}" : "${
            classes.hidden
          }"`}
        >
          <amp-lightbox
            class={classes.lightbox}
            animate-in={animationByAnchor[anchor]}
            amp-bind={`open=>${ampStateId}.open`}
            layout="nodisplay"
          >
            <div
              className={classes.container}
              on={`tap:AMP.setState({ ${ampStateId}: { open: true }})`}
            >
              {showCloseButton && anchor === 'bottom' && (
                <Fab
                  color="primary"
                  className={classes.closeButton}
                  on={`tap:AMP.setState({ ${ampStateId}: { open: false }})`}
                  {...closeButtonProps}
                >
                  <Close />
                </Fab>
              )}
              <div className={classes.content}>
                <Paper square>{children}</Paper>
              </div>
            </div>
          </amp-lightbox>
        </div>
      </React.Fragment>
    )
  }
}
