/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { Helmet } from 'react-helmet'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { inject } from 'mobx-react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

export const styles = theme => ({
  root: {
  },
  panel: {
    margin: `${theme.margins.container}px 0`
  },
  hidden: {
    display: 'none'
  },
  ampSelector: {
    '& [option][selected]': {
      outline: 'none',
      cursor: 'inherit'
    }
  },
  ampPanel: {
    display: 'none',
    '&[selected]': {
      display: 'block',
    }
  },
  ampTab: {
    opacity: 1,
    '& .label': {
      borderBottom: `2px solid transparent`,
      opacity: 0.7,
      padding: '15px 12px 14px 12px',
    },
    '& .selected': {
      borderBottom: `2px solid ${theme.palette.secondary.main}`,
      opacity: 1
    }
  },
  ampTabLabelContainer: {
    padding: 0
  },
  ampTabIndicator: {
    display: 'none'
  }
})

/**
 * A simple tab panel that is AMP-compatible.  Tab names are pull from the label prop of the child elements.  
 * Any type of element can be a child.
 * 
 * Example:
 * 
 *  <TabPanel>
 *    <div label="Description">
 *      Description here
 *    </div>
 *    <CmsSlot label="Instructions">
 *      { instructionsFromCms }
 *    </CmsSlot>
 *  </TabPanel>
 */
@withStyles(styles, { name: 'RSFTabPanel' })
@inject('app', 'ampStateId')
export default class TabPanel extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      selected: props.selected
    }
  }

  static propTypes = {
    /**
     * Set to false to prevent the tabs from scrolling
     */
    scrollable: PropTypes.bool,
    /**
     * Selected tab index
     */
    selected: PropTypes.number,
    /**
     * On change callback
     */
    onChange: PropTypes.func,
  }

  static defaultProps = {
    ampStateId: 'moovAmpState',
    ampStateProperty: 'selectedTab',
    scrollable: true,
    selected: 0
  }

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.selected === 'number') {
      this.setState({ selected: nextProps.selected });
    }
  }

  render() {
    const { selected } = this.state
    const { children, classes, app, ampStateId, ampStateProperty, scrollable } = this.props
    const { amp } = app

    let panels = []
    const tabs = []

    React.Children.forEach(children, (child, i) => {

      let { label } = child.props

      if (amp) {
        label = (
          <div 
            className={classnames('label', { selected: selected === i })} 
            amp-bind={`class=>${ampStateId}.${ampStateProperty} == "tab${i}" ? 'label selected' : 'label'`}
          >
            {label}
          </div>
        )
      }

      tabs.push(
        <Tab 
          key={i}
          label={label}
          on={`tap:AMP.setState({ ${ampStateId}: { ${ampStateProperty}: 'tab${i}' }})`}
          classes={{
            root: classnames({ [classes.ampTab]: amp }),
            labelContainer: classnames({ [classes.ampTabLabelContainer]: amp })
          }}
        />
      )
      
      panels.push(
        <div 
          key={i}
          role="tabpanel" 
          option={`tab${i}`} 
          selected={i===selected}
          className={
            classnames(classes.panel, { 
              [classes.hidden]: !amp && i !== selected,
              [classes.ampPanel]: amp
            })
          }
        >
          { React.cloneElement(child, { label: null }) }
        </div>
      )
    })

    if (amp) {
      panels = (
        <amp-selector 
          role="tablist" 
          amp-bind={`selected=>${ampStateId}.${ampStateProperty}`}
          class={classes.ampSelector}
        >
          {panels}
        </amp-selector>
      )
    }

    return (
      <div className={classes.root}>
        { amp && (
          <Helmet>
            <script async custom-element="amp-selector" src="https://cdn.ampproject.org/v0/amp-selector-0.1.js"></script>
            <script async custom-element="amp-bind" src="https://cdn.ampproject.org/v0/amp-bind-0.1.js"></script>
          </Helmet>
        )}
        <Tabs 
          scrollable={scrollable}
          value={selected} 
          onChange={this.onChange}
          classes={{
            indicator: classnames({ [classes.ampTabIndicator]: amp })
          }}
        >
          { tabs }
        </Tabs>
        { panels }
      </div>
    )
  }

  onChange = (event, selected) => {
    const { onChange } = this.props

    this.setState({ selected })
    if (onChange) {
      onChange(selected)
    }
  }

}