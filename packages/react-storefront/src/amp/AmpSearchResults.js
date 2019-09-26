/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import Container from '../Container'
import Link from '../Link'
import CircularProgress from '@material-ui/core/CircularProgress'

export const styles = theme => ({
  results: {},
  groupCaption: {},
  thumbnailGroup: {},
  group: {},
  thumbnail: {},
  loading: {}
})

@withStyles(styles, { name: 'RSFAmpSearchResults' })
export default class AmpSearchResults extends Component {
  static propTypes = {
    ampThumbnailHeight: PropTypes.number,
    ampThumbnailWidth: PropTypes.number
  }

  render() {
    const { classes, ampThumbnailHeight, ampThumbnailWidth } = this.props

    return (
      <div className={classes.results}>
        <amp-list
          layout="fill"
          amp-bind={`src=>"/search/suggest.json?q=" + (rsfSearchDrawer.searchText ? encodeURIComponent(rsfSearchDrawer.searchText) : '')`}
          items="search.groups"
          noloading
          reset-on-refresh
        >
          <div placeholder="true">
            <div className={classes.loading}>
              <CircularProgress />
            </div>
          </div>
          <template type="amp-mustache">
            <Container>
              <Typography className={classes.groupCaption}>{'{{caption}}'}</Typography>
              <ul
                amp-bind={`class=>{{thumbnails}} ? "${classes.thumbnailGroup}" : "${
                  classes.group
                }"`}
              >
                {'{{#results}}'}
                <li data-thumbnail={'{{thumbnail}}'}>
                  <Link to="{{url}}">
                    {'{{#thumbnail}}'}
                    <amp-img
                      class={classes.thumbnail}
                      src="{{thumbnail}}"
                      height={ampThumbnailHeight}
                      width={ampThumbnailWidth}
                    />
                    {'{{/thumbnail}}'}
                    <Typography>{'{{text}}'}</Typography>
                  </Link>
                </li>
                {'{{/results}}'}
              </ul>
            </Container>
          </template>
        </amp-list>
      </div>
    )
  }
}
