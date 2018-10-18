/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component, Fragment } from 'react'
import withStyles from "@material-ui/core/styles/withStyles"
import classnames from 'classnames'
import ResponsiveTiles from './ResponsiveTiles'
import PropTypes from 'prop-types'
import withStyleProps from './withStyleProps'
import { observer, inject } from 'mobx-react'
import Image from './Image'

export const styles = theme => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch'
  },

  blankRow: {
    height: `${theme.margins.row}px`
  },
  
  space: {
    backgroundColor: 'white',
    width: theme.margins.container + 'px'
  },

  '@keyframes shimmer': {
    from: { backgroundPosition: '-468px 0'},
    to: { backgroundPosition: '468px 0' }
  },
  
  shimmer: {
    backgroundColor: theme.palette.background.shade,
    animationDuration: '1s',
    animationFillMode: 'forwards',
    animationIterationCount: 'infinite',
    animationName: 'shimmer',
    animationTimingFunction: 'linear',
    background: `linear-gradient(to right, #eee 8%, #e6e6e6 18%, #eee 33%)`,
    backgroundSize: '800px 104px',
    zIndex: 1
  },

  fullscreen: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: theme.headerHeight
  },

  filledContent: {
    backgroundColor: theme.palette.background.paper
  }
})

/**
 * The root component for a skeleton view
 */
export const Skeleton = withStyles(styles)(
  ({ classes, children, fullscreen=false }) => (
    <div 
      className={
        classnames({ 
          [classes.shimmer]: true, 
          [classes.fullscreen]: fullscreen 
        })
      }
    >
      {children}
    </div>
  )
)

/**
 * A row of space and content
 */
export const Row = withStyles(styles)(
  ({ wrap, className, classes, children, ...style }) => (
    <div 
      className={classnames(classes.row, className)} 
      style={{ flexWrap: wrap && 'wrap', ...style }}
    >
      {children}
    </div>
  )
)

/**
 * White space between content
 */
export const Space = withStyles(styles)(
  ({ classes, ...style }) => <div className={classes.space} style={style}/>
)

/**
 * A placeholder for content with a gray background that shimmers
 */
export const Content = withStyles(styles)(({ children, classes, ...style }) => {
  if (children) {
    return <div className={classes.filledContent} style={{ ...style }}>{children}</div>
  } else {
    return <div style={{ ...style }}/>
  }
})

/**
 * A blank row.  You provide the height
 */
export const BlankRow = withStyles(styles)(({ classes, ...others }) => (
  <Row className={classes.blankRow} {...others}>
    <Space flex={1} />
  </Row>
))

/**
 * When using ResposiveTiles in your view, use this component to replace
 * it in the load mask.
 */
@withStyleProps(({ theme, spacing }) => ({
  root: {
    borderStyle: 'solid',
    borderColor: theme.palette.background.paper,
    borderWidth: `${spacing/2}px`
  },
  tile: {
    borderStyle: 'solid',
    borderColor: theme.palette.background.paper,
    borderWidth: `0 ${spacing/2}px`
  }
}), { name: 'RSFSkeletonTiles' })
export class Tiles extends Component {

  static propTypes = {
    /**
     * Should be the same as the spacing set on the ResponsiveTiles element
     * that you're replacing.
     */
    spacing: PropTypes.number
  }

  render() {
    const { spacing, classes, className, children, ...others } = this.props
    
    return (
      <ResponsiveTiles 
        spacing={0} 
        className={classnames(classes.root, className)} 
        {...others}
      >
        { React.Children.map(children, (child, i) => (
          <div className={classes.tile} key={i}>
            { child }
          </div>
        ))}
      </ResponsiveTiles>
    )
  }

}

Tiles.defaultProps = {
  spacing: 15
}

@withStyles(theme => ({
  image: {
    width: '100%'
  }
}))
@inject('app')
@observer
export class ImageSwitcher extends Component {

  static propTypes = {
    thumbnails: PropTypes.bool
  }

  static defaultProps = {
    thumbnails: true
  }

  render() {
    const { app, classes, thumbnails } = this.props

    return (
      <Fragment>
        { app.productThumbnail ? (
          <Row>
            <Content flex="1">
              <Image src={app.productThumbnail} className={classes.image} fill/>
            </Content>      
          </Row>
        ) : (
          <Row className={classes.image}/>
        )}
        { thumbnails ? (
          <Fragment>
            <BlankRow/>
            <Row height="58px">
              <Space/>
              <Content flex="1"/>
              <Space/>
            </Row>
          </Fragment>
        ) : null}
      </Fragment>
    )
  }
}
