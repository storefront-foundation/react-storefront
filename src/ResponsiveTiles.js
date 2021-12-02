import React, { useRef } from 'react'
import { styled } from '@mui/material/styles';
import { ImageListItem } from '@mui/material'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import AutoScrollToNewChildren from './AutoScrollToNewChildren'

const PREFIX = 'ResponsiveTiles';

const classes = {
  root: `${PREFIX}-root`,
  tile: `${PREFIX}-tile`
};

const Root = styled('ul')((
  {
    theme
  }
) => {
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
    [`&.${classes.root}`]: {
      display: 'flex',
      flexWrap: 'wrap',
      overflowY: 'auto',
      listStyle: 'none',
      padding: 0,
      margin: theme.spacing(-spacing),
      WebkitOverflowScrolling: 'touch', // Add iOS momentum scrolling.
    },
    [`& .${classes.tile}`]: {
      ...breakpoints,
      padding: theme.spacing(spacing),
      height: 'auto',
    },
  };
});

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
   * If `true`, automatically scroll to the first new tile when the
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
   */
  cols: PropTypes.shape({
    xs: PropTypes.number,
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number,
  }),

  /**
   * The spacing between the tiles in theme spacing units.
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
  function maybeWrapInAutoScroll(doWrap) {
    return function(elements) {
      if (doWrap) {
        return <AutoScrollToNewChildren>{elements}</AutoScrollToNewChildren>
      } else {
        return elements
      }
    }
  }

  return function Tiles({ className,  autoScrollToNewTiles, children, ...other }) {


    return (
      <Root className={clsx(className, classes.root)} {...other}>
        {maybeWrapInAutoScroll(autoScrollToNewTiles)(
          React.Children.map(children, (child, i) => {
            if (!React.isValidElement(child)) {
              return null
            }
            return (
              <ImageListItem key={i} classes={{ root: classes.tile }}>
                {child}
              </ImageListItem>
            )
          }),
        )}
      </Root>
    );
  };
}
