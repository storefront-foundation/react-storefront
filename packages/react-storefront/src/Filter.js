/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import get from 'lodash/get'
import { observer, inject } from 'mobx-react'
import ExpandableSection from './ExpandableSection'
import Checkbox from '@material-ui/core/Checkbox'
import LoadMask from './LoadMask'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import { Hbox } from './Box'

/**
 * UI for filtering an instance of SearchResultModelBase.  This component can be used on its own, or you can use
 * FilterButton to automatically display this component in a drawer that slides up from the bottom of the viewport.
 */
export const styles = theme => ({
  root: { 
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  facetGroups: {
    overflow: 'auto',
    overflowX: 'hidden',
    flex: '1',
    position: 'relative'
  },
  matches: {
    marginLeft: '5px',
    display: 'inline'
  },
  footer: {
    backgroundColor: theme.palette.secondary.main,
    padding: '12px 20px',
    color: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemsFound: {
    color: theme.palette.secondary.contrastText
  },
  title: {
    ...theme.typography.subtitle1,
    marginBottom: `12px`
  },
  noMargins: {
    margin: 0
  },
  groupLabel: {
    display: 'flex',
    alignItems: 'center'
  }
});

@withStyles(styles, { name: 'RSFFilter' })
@inject('router')
@observer
export default class Filter extends Component {

  static propTypes = {
    /**
     * An instance of `SearchResultModelBase`
     */
    model: PropTypes.object,

    /**
     * CSS classes
     */
    classes: PropTypes.object,

    /**
     * A function to call when the user clicks the button to view updated results.  The default behavior can be
     * canceled by calling `preventDefault` on the passed in event.  The event is passed as the only argument.
     */
    onViewResultsClick: PropTypes.func,

    /**
     * The query string parameter that should be updated when filters are changed.  The value will be an array
     * of codes for each selected facet.  Defaults to "filters"
     */
    queryParam: PropTypes.string,

    /**
     * An optional title to display at the top of the component.
     */
    title: PropTypes.string,

    /**
     * Set to false to remove the default left and right margins. Defaults to `true`.
     */
    margins: PropTypes.bool,

    /**
     * Set to `true` to expand all groups on initial render
     */
    expandAll: PropTypes.bool
  }

  static defaultProps = {
    onViewResultsClick: Function.prototype,
    queryParam: 'filters',
    margins: true
  }

  constructor(props) {
    super(props)

    this.state = {
      expanded: props.expandAll ? this.createExpandAllState() : {}
    }
  }

  render() {
    const { model, classes, title } = this.props

    return (
      <div className={classes.root}>
        { title ? <div className={classes.title}>{title}</div> : null }
        <div className={classes.facetGroups}>
          <LoadMask show={model.loading} transparent align="top" />
          { get(model, 'facetGroups', []).map((facetGroup, i) => this.renderFacetGroup(facetGroup, i)) }
        </div>
        { model.filtersChanged && (
          <Hbox className={classes.footer} split>
            <Typography variant="subtitle1" className={classes.itemsFound}>{model.filters.length || 'No'} filter{model.filters.length === 1 ? '' : 's'} selected</Typography>
            <Button variant="contained" size="large" color="default" onClick={this.onViewResultsClick}>View Results</Button>
          </Hbox>
        )}
      </div>
    )
  }

  renderFacetGroup(group, key) {
    const { model, classes, margins } = this.props
    const { expanded } = this.state
    const selection = []

    const formGroup = (
      <FormGroup key={key}>
        { group.facets.map((facet, i) => {
          let checked = false

          if (get(model, 'filters', []).indexOf(facet.code) !== -1) {
            selection.push(facet)
            checked = true
          }

          return (
            <FormControlLabel
              key={i}
              label={
                <div className={classes.groupLabel}>
                  <span>{facet.name}</span>
                  <Typography variant="caption" className={classes.matches} component="span">({facet.matches})</Typography>
                </div>
              }
              control={
                <Checkbox
                  checked={checked}
                  color="primary"
                  onChange={this.onToggleFilter.bind(this, facet)}
                />
              }
            />
          )
        })}
      </FormGroup>
    )

    let caption = null

    if (selection.length === 1) {
      caption = selection[0].name
    } else if (selection.length > 0) {
      caption = `${selection.length} selected`
    }

    return (
      <ExpandableSection
        key={key}
        title={group.name}
        caption={caption}
        expanded={expanded[group.name]}
        onChange={(e, expanded) => this.setState({ expanded: { ...this.state.expanded, [group.name]: expanded }})}
        margins={margins}
      >
        {expanded[group.name] && formGroup}
      </ExpandableSection>
    )
  }

  onToggleFilter = (facet) => {
    this.props.model.toggleFilter(facet)

    if(this.props.refreshOnChange) {
      this.refresh()
    }
  }

  onViewResultsClick = (e) => {
    this.props.onViewResultsClick(e)

    if (!e.isDefaultPrevented()) {
      this.refresh()
    }
  }

  refresh() {
    const { router, model } = this.props
    router.applySearch({
      [this.props.queryParam]: model.filters.toJSON()
    })
    model.refresh()
  }

  createExpandAllState = () => {
    const state = {}
    const { model } = this.props

    if (model) {
      for (let group of model.facetGroups) {
        state[group.name] = true
      }
    }

    return state
  }

}
