/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import GridListTile from '@material-ui/core/GridListTile'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'

/**
 * A responsive grid of tiles that changes the number of columns based on the viewport size.
 * This component commonly used in product listings and search results.
 */
export default class ResponsiveTiles extends Component {
  constructor(props) {
    super(props)
    this.Tiles = createInner(props)
  }

  static propTypes = {
    /**
     * A map of viewport widths to number of columns.  For example:
     * ```
     *  cols={{
     *    xs: 2,
     *    sm: 3,
     *    md: 4,
     *    lg: 5,
     *    xl: 5
     *  }}
     * ```
     *
     * The amounts shown in the example above are the defaults.
     */
    cols: PropTypes.object,

    /**
     * The spacing between the tiles in pixels. Defaults to 15
     */
    spacing: PropTypes.number
  }

  static defaultProps = {
    cols: {
      xs: 2,
      sm: 3,
      md: 4,
      lg: 5,
      xl: 5
    },
    spacing: 15
  }

  render() {
    const { Tiles } = this
    const { cols, spacing, ...others } = this.props
    return <Tiles {...others} />
  }
}

function createInner({ spacing, cols }) {
  const styles = theme => {
    let breakpoints = {}

    // Breakpoints MUST be set in order from smallest to largest
    Object.keys(cols)
      .map(width => {
        return {
          key: width,
          value: cols[width],
          width: `${100 / cols[width]}%`
        }
      })
      .sort((a, b) => a.value - b.value)
      .forEach(({ key, width }) => {
        breakpoints[theme.breakpoints.up(key)] = { width }
      })

    return {
      root: {
        display: 'flex',
        flexWrap: 'wrap',
        overflowY: 'auto',
        listStyle: 'none',
        padding: 0,
        margin: `-${spacing / 2}px`,
        WebkitOverflowScrolling: 'touch' // Add iOS momentum scrolling.
      },
      tile: {
        ...breakpoints,
        padding: `${spacing / 2}px`,
        height: 'auto'
      }
    }
  }

  const ResponsiveTilesInner = class extends Component {
    render() {
      const { className, classes, children, ...other } = this.props

      return (
        <ul className={classnames(className, classes.root)} {...other}>
          {React.Children.map(children, (child, i) => {
            if (!React.isValidElement(child)) {
              return null
            }
            return (
              <GridListTile key={i} classes={{ root: classes.tile }}>
                {child}
              </GridListTile>
            )
          })}
        </ul>
      )
    }
  }

  return withStyles(styles, { name: 'RSFResponsiveTiles' })(ResponsiveTilesInner)
}
