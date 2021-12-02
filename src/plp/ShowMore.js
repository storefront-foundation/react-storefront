import React, { useState, useContext } from 'react'
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types'
import { CircularProgress, Button } from '@mui/material'
import clsx from 'clsx'
import SearchResultsContext from './SearchResultsContext'
import VisibilitySensor from 'react-visibility-sensor'

const PREFIX = 'RSFShowMore';

const classes = {
  root: `${PREFIX}-root`,
  button: `${PREFIX}-button`,
  loading: `${PREFIX}-loading`
};

const StyledCircularProgress = styled(CircularProgress)((
  {
    theme
  }
) => ({
  /**
   * Styles applied to the root element.
   */
  [`& .${classes.root}`]: {
    margin: '15px 0',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },

  /**
   * Styles applied to the button element.
   */
  [`& .${classes.button}`]: {
    [theme.breakpoints.down('sm')]: {
      flex: 1,
    },
  },

  /**
   * Styles applied to the loading icon.
   */
  [`& .${classes.loading}`]: {
    display: 'flex',
    height: 45,
    justifyContent: 'center',
  }
}));

export {};

const VARIANTS = {
  BUTTON: 'button',
  INFINITE: 'infinite',
}

/**
 * A control that handles loading the next page of results in a search results
 * page or PLP.  This component can either display a "Show More" button:
 *
 * ```js
 * <ShowMore variant="button"/>
 * ```
 * ... or can produce an "infinite scroll" effect that loads more records when the user
 * scrolls within a configured offset from the bottom of the page:
 *
 * ```js
 * <ShowMore variant="infinite" infiniteLoadOffset={200}/>
 * ```
 *
 * This component should always be used inside a `<SearchResultsProvider/>`.
 *
 * This component relies on the following properties being defined in `pageData` in the page store:
 *
 * * `page` - The current page number
 * * `totalPages` - The total number of pages
 */
export default function ShowMore({
  className,
  style,
  children,
  variant,
  href,
  infiniteLoadOffset,
  renderLoadingIcon,
  ...others
}) {

  const [loading, setLoading] = useState(false)
  const { actions, pageData } = useContext(SearchResultsContext)

  if (pageData && pageData.page >= pageData.totalPages - 1) return null

  async function fetchMore() {
    if (!loading) {
      setLoading(true)

      try {
        await actions.fetchMore()
      } finally {
        setLoading(false)
      }
    }
  }

  function handleVisible(isVisible) {
    if (isVisible) {
      fetchMore()
    }
  }

  if (variant === VARIANTS.INFINITE) {
    return (
      <VisibilitySensor
        onChange={handleVisible}
        partialVisibility
        offset={{ bottom: -infiniteLoadOffset }}
      >
        <div className={clsx(classes.loading, className)} style={style}>
          {renderLoadingIcon()}
        </div>
      </VisibilitySensor>
    )
  } else {
    return (
      <div className={clsx(classes.root, className)} style={style}>
        {loading ? (
          <div className={classes.loading}>{renderLoadingIcon()}</div>
        ) : (
          <Button
            variant="contained"
            color="primary"
            href={href}
            className={classes.button}
            onClick={fetchMore}
            {...others}
          >
            {children || 'Show More'}
          </Button>
        )}
      </div>
    )
  }
}

ShowMore.propTypes = {
  /**
   * A renderer for the loading icon.  Uses `<CircularProgress />` by default.
   */
  renderLoadingIcon: PropTypes.func,
  /**
   * Which variant to use. One of `'button'` or `'infinite'`.
   *
   * When variant is set to `'button'`:
   *   A button is rendered with contents of `{props.children}` or `'Show More'`.
   *
   * When variant is set to `'infinite'`:
   *   The loading icon is rendered and contents of next page loaded when user
   *   scrolls to the end of the page.
   *
   * In AMP the `'button'` variant is always used.
   */
  variant: PropTypes.oneOf([VARIANTS.BUTTON, VARIANTS.INFINITE]),
  /**
   * Minimum amount of pixels from the bottom of the page to where the user has
   * scrolled before the new page is loaded. Used in conjunction with `'infinite'`
   * variant. Defaults to 200.
   */
  infiniteLoadOffset: PropTypes.number,
  /**
   * When specified, clicking the button will navigate to the specified URL with a full page reload.
   */
  href: PropTypes.string,
  /**
   * A CSS class to apply to the root element.
   */
  className: PropTypes.string,
  /**
   * CSS styles to be added to the root element.
   */
  style: PropTypes.object,
}

ShowMore.defaultProps = {
  renderLoadingIcon: () => <StyledCircularProgress />,
  variant: VARIANTS.BUTTON,
  infiniteLoadOffset: 200,
}
