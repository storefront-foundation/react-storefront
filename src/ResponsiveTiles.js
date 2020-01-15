import React, { useRef } from 'react'
import { GridListTile } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import AutoScrollToNewChildren from './AutoScrollToNewChildren'

/**
 * A responsive grid of tiles that changes the number of columns based on the viewport size.
 * This component commonly used in product listings and search results.
 */
export default function ResponsiveTiles(props) {
  const Tiles = useRef(createTiles(props))
  const { cols, spacing, ...others } = props
  return <Tiles.current {...others} />
}

ResponsiveTiles.propTypes = {
  /**
   * Whether to automatically scroll to the first new tile when the
   * number of tiles is increased.
   */
  autoScrollToNewTiles: PropTypes.bool,

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
   * The spacing between the tiles in theme spacing units. Defaults to 1
   */
  spacing: PropTypes.number,
}

ResponsiveTiles.defaultProps = {
  autoScrollToNewTiles: false,
  cols: {
    xs: 2,
    sm: 3,
    md: 4,
    lg: 5,
    xl: 5,
  },
  spacing: 1,
}

function createTiles({ cols, spacing }) {
  const useStyles = makeStyles(theme => {
    let breakpoints = {}

    // Breakpoints MUST be set in order from smallest to largest
    Object.keys(cols)
      .map(width => {
        return {
          key: width,
          value: cols[width],
          width: `${100 / cols[width]}%`,
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
        margin: `-${theme.spacing(spacing)}px`,
        WebkitOverflowScrolling: 'touch', // Add iOS momentum scrolling.
      },
      tile: {
        ...breakpoints,
        padding: `${theme.spacing(spacing)}px`,
        height: 'auto',
      },
    }
  }, 'RSFResponsiveTiles')

  function maybeWrapInAutoScroll(doWrap) {
    return function(elements) {
      if (doWrap) {
        return <AutoScrollToNewChildren>{elements}</AutoScrollToNewChildren>
      } else {
        return elements
      }
    }
  }

  return function Tiles({ className, classes, autoScrollToNewTiles, children, ...other }) {
    classes = useStyles({ classes })

    return (
      <ul className={clsx(className, classes.root)} {...other}>
        {maybeWrapInAutoScroll(autoScrollToNewTiles)(
          React.Children.map(children, (child, i) => {
            if (!React.isValidElement(child)) {
              return null
            }
            return (
              <GridListTile key={i} classes={{ root: classes.tile }}>
                {child}
              </GridListTile>
            )
          }),
        )}
      </ul>
    )
  }
}
