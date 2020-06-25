import React, { useContext } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Link from '../link/Link'
import PropTypes from 'prop-types'
import Image from '../Image'
import SearchContext from './SearchContext'
import Highlight from '../Highlight'

export const styles = theme => ({
  root: {
    margin: theme.spacing(2, 0),
    listStyle: 'none',
    padding: 0,
    '& [data-ui=thumbnails]': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  thumbnail: {
    marginBottom: '10px',
    display: 'none',
    '[data-ui=thumbnails] &': {
      display: 'block',
      '& img': {
        height: 120,
        width: 120,
        minWidth: 120,
      },
    },
  },
  text: {
    '& .highlight': {
      backgroundColor: 'rgba(0,0,0,0.05)',
      borderRadius: '2px',
      color: theme.palette.secondary.main,
    },
  },
})

const useStyles = makeStyles(styles, { name: 'RSFSearchSuggestionItem' })

export default function SearchSuggestionItem({
  ImageComponent,
  classes,
  item,
  ui,
  thumbnailProps,
  children,
}) {
  classes = useStyles({ classes })

  const { query } = useContext(SearchContext)

  return (
    <li className={classes.root}>
      <Link as={item.as} href={item.href} pageData={item.pageData}>
        {children ? (
          children
        ) : (
          <a>
            <div data-ui={ui}>
              <ImageComponent
                className={classes.thumbnail}
                {...thumbnailProps}
                {...item.thumbnail}
              />
              <Highlight query={query} text={item.text} className={classes.text} />
            </div>
          </a>
        )}
      </Link>
    </li>
  )
}

SearchSuggestionItem.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,
  /**
   * Child nodes that can be used for the link body. If not included, will default to using the
   * [item](prop-item)'s `thumbnail` and `text`.
   */
  children: PropTypes.node,
  /**
   * Contains all the metadata needed to display the search suggestion item.
   */
  item: PropTypes.shape({
    as: PropTypes.string,
    href: PropTypes.string,
    text: PropTypes.string,
    pageData: PropTypes.object,
    thumbnail: PropTypes.object,
  }),
  /**
   * Props to be passed to the image for thumbnails.
   */
  thumbnailProps: PropTypes.object,
  /**
   * The component type to use to display images.
   */
  ImageComponent: PropTypes.elementType,
}

SearchSuggestionItem.defaultProps = {
  ImageComponent: Image,
}
