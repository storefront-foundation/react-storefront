/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import get from 'lodash/get'
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import ListViewIcon from '@material-ui/icons/ViewAgenda'
import GridViewIcon from '@material-ui/icons/BorderAll'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { LAYOUT_LIST,  LAYOUT_GRID } from './model/SearchResultsModelBase'
import Paper from '@material-ui/core/Paper'

/**
 * A header that allows the user to navigate back.  When a searchResults prop is provided,
 * this component also allows the user to switch between grid and list views.
 */
export const styles = theme => ({
  root: {
    padding: '6px 86px',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderTop: `1px solid ${theme.palette.divider}`,
    zIndex: theme.zIndex.appBar - 1,

    '& a': {
      color: theme.palette.text.primary,
      textDecoration: 'none',
    }
  },
  label: {
    fontWeight: 'bold',
    fontSize: '18px',
    display: 'block',
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  backButtonWrapper: {
    position: 'absolute',
    top: 0,
    left: '5px',
    height: '41px',
    display: 'flex',
    alignItems: 'center'
  },
  switchButtonsWrapper: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    top: 0,
    right: '10px',
    height: '41px'
  },
  switchButton: {
    marginLeft: '5px',
    alignItems: 'center',
    display: 'flex',
    padding: '3px',
    borderRadius: '50%'
  },
  selectedSwitchButton: {
    backgroundColor: '#F4F2F1'
  }
})

@withStyles(styles, { name: 'RSFBackNav' })
@inject('history')
@observer
export default class BackNav extends Component {

  static propTypes = {
    /**
     * The text to display representing the previous location.
     */
    text: PropTypes.string.isRequired,

    /**
     * The url to navigate to when clicked.  If omitted, this component will navigate back in the history when clicked.
     */
    url: PropTypes.string,

    /**
     * When displaying this component on a search results page (such as a subcategory), you can supply the SearchResultsModelBase instance here
     * and this component will allow you to switch between grid and list views.
     */
    searchResults: PropTypes.shape({
      layout: PropTypes.string.isRequired,
    })
  }

  switchLayout = (layout) => {
    const { searchResults } = this.props
    searchResults.switchLayout(layout)
  }

  renderViewToggle() {
    const { classes, searchResults } = this.props
    const layout = get(searchResults, 'layout', LAYOUT_GRID)

    return searchResults ? (
      <span className={classes.switchButtonsWrapper}>
        <span className={classnames(classes.switchButton, {[classes.selectedSwitchButton]: layout === LAYOUT_GRID})}>
          <GridViewIcon
            color={layout === LAYOUT_GRID ? 'secondary' : 'primary'}
            onClick={() => (this.switchLayout(LAYOUT_GRID))}
          />
        </span>
        <span className={classnames(classes.switchButton, {[classes.selectedSwitchButton]: layout === LAYOUT_LIST})}>
          <ListViewIcon
            color={layout === LAYOUT_LIST ? 'secondary' : 'primary'}
            onClick={() => (this.switchLayout(LAYOUT_LIST))}
          />
        </span>
      </span>
    ) : null
  }

  render() {
    const { text, classes } = this.props

    return (
      <Paper className={classes.root} >
        <Typography variant="caption">
          <span onClick={() => {this.onBack()}} className={classes.backButtonWrapper}>
            <ArrowLeft />
          </span>
          <span className={classes.label}>{text}</span>
          { this.renderViewToggle() }
        </Typography>
      </Paper>
    )
  }

  onBack = () => {
    const { history, url } = this.props

    if (url) {
      history.push(url)
    } else {
      history.goBack()
    }
  }

}
