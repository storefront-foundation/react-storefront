/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { get } from 'lodash';
import { observer, inject } from 'mobx-react';
import ExpandableSection from './ExpandableSection'
import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import { types } from "mobx-state-tree"
import { Hbox } from './Box'

/**
 * UI for filtering an instance of SearchResultModelBase.  This component can be used on its own, or you can use
 * FilterButton to automatically display this component in a drawer that slides up from the bottom of the viewport.
 */
export const styles = theme => ({
  root: {
    height: '50vh',
    overflowY: 'auto',
    paddingBottom: '64px'
  },
  matches: {
    marginLeft: '5px',
    display: 'inline'
  },
  footer: {
    backgroundColor: theme.palette.secondary.main,
    padding: '12px 20px',
    color: 'white',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    transform: 'translate3d(0,0,0)'
  },
  itemsFound: {
    color: theme.palette.secondary.contrastText
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
    queryParam: PropTypes.string
  }

  static defaultProps = {
    onViewResultsClick: Function.prototype,
    queryParam: 'filters'
  }

  state = {
    expanded: {}
  }

  render() {
    const { model, classes } = this.props

    return (
      <div className={classes.root}>
       { get(model, 'facetGroups', []).map((facetGroup, i) => this.renderFacetGroup(facetGroup, i)) }
       { model.filtersChanged && (
        <Hbox className={classes.footer} split>
          <Typography variant="subheading" className={classes.itemsFound}>{model.filters.length || 'No'} filter{model.filters.length === 1 ? '' : 's'} selected</Typography>
          <Button variant="raised" size="large" color="default" onClick={this.onViewResultsClick}>View Results</Button>
        </Hbox>
       )}
      </div>
    )
  }

  renderFacetGroup(group, key) {
    const { app, model, classes } = this.props
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
                <span>
                  <span>{facet.name}</span>
                  <Typography variable="caption" className={classes.matches} component="span">({facet.matches})</Typography>
                </span>
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
        onChange={(e, expanded) => this.setState({ expanded: { ...expanded, [group.name]: expanded }})}
      >
        {formGroup}
      </ExpandableSection>
    )
  }

  onToggleFilter = (facet) => {
    this.props.model.toggleFilter(facet)
  }

  onViewResultsClick = (e) => {
    const { router, model } = this.props

    this.props.onViewResultsClick(e)

    if (!e.isDefaultPrevented()) {
      this.props.model.setFiltersChanged(false)
      router.applySearch({
        [this.props.queryParam]: model.filters.toJSON()
      }) 
    }
  }

}

