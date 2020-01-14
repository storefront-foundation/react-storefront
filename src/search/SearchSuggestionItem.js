import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Link from '../link/Link'
import { Typography } from '@material-ui/core'
import PropTypes from 'prop-types'
import Image from '../Image'

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
              <Typography>{item.text}</Typography>
            </div>
          </a>
        )}
      </Link>
    </li>
  )
}

SearchSuggestionItem.propTypes = {
  /**
   * The component to use to display images.
   */
  ImageComponent: PropTypes.func,
}

SearchSuggestionItem.defaultProps = {
  ImageComponent: Image,
}
