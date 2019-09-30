/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import LoadMask from './LoadMask'
import withStyles from '@material-ui/core/styles/withStyles'
import universal from 'react-universal-component'
import Container from './Container'
import Row from './Row'
import red from '@material-ui/core/colors/red'
import { waitForServiceWorkerController } from './router/serviceWorker'

export const styles = theme => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    boxSizing: 'border-box'
  },
  error: {
    background: red[800],
    color: 'white',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999999,
    overflow: 'auto'
  }
})

/**
 * Switches the app's main view based on the value of the `page` in `AppModelBase`.  Props are spread to
 * component that is displayed.
 */
@withStyles(styles, { name: 'RSFPages' })
@inject(({ app }) => ({
  app,
  page: app.page,
  loading: app.loading
}))
@observer
export default class Pages extends Component {
  static propTypes = {
    /**
     * An object which serves as a map of page name to component to display.  When the value of `page`
     * in `AppModelBase` matches a key in this object, the corresponding component will be displayed.
     */
    components: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,

    /**
     * An object which serves as a map of page name to mask to display when the page is loading.  When the value of `page`
     * in `AppModelBase` matches a key in this object, the corresponding mask will be displayed.
     */
    loadMasks: PropTypes.object
  }

  static defaultProps = {
    loadMasks: {},
    components: {}
  }

  state = {
    loadingComponent: false
  }

  mounted = false
  cache = {}

  constructor(props) {
    super(props)
    const { components, app } = props

    if (typeof components === 'function') {
      this.components = components(this.createUniversalComponent)
    } else {
      this.components = components
    }

    this.createAndCachePage(app.page)
  }

  componentDidMount() {
    this.mounted = true
    this.preloadPageComponents()
  }

  async preloadPageComponents() {
    await waitForServiceWorkerController()

    const whenIdle = window.requestIdleCallback || window.requestAnimationFrame

    whenIdle(() => {
      for (let key in this.components) {
        try {
          if (this.components[key].preload) {
            this.components[key].preload()
          }
        } catch (e) {
          console.warn('could not preload page component', key, e)
        }
      }
    })
  }

  componentWillUpdate(nextProps) {
    const { page } = nextProps.app

    if (page !== this.page) {
      this.createAndCachePage(page)
      this.page = page
    }
  }

  /**
   * Creates a lazy component that automatically manages the loading spinner
   * @param {React.Component} comp The component to make lazy
   * @return {React.Component}
   */
  createUniversalComponent = comp => {
    return universal(comp, {
      loading: this.componentLoadMask,
      onLoad: this.onLoad,
      onError: this.onError,
      error: this.errorView
    })
  }

  createAndCachePage(page) {
    if (this.cache[page]) return

    const Comp = this.components[page]

    if (Comp) {
      this.cache[page] = {
        element: (
          <Comp
            key={page}
            onBefore={this.onStartLoadingComponent}
            onAfter={this.onEndLoadingComponent}
          />
        )
      }
    }
  }

  render() {
    const { classes, app } = this.props
    const loading = this.isLoading()
    let elements = []

    for (let page in this.cache) {
      const entry = this.cache[page]

      elements.push(
        <div
          key={page}
          data-page={page}
          style={{ display: page === app.page && !loading ? 'block' : 'none' }}
        >
          {entry.element}
        </div>
      )
    }

    return (
      <div className={classes.root}>
        {this.renderLoadMask()}
        {elements}
      </div>
    )
  }

  onStartLoadingComponent = () => {
    if (this.mounted) this.setState({ loadingComponent: true })
  }

  onEndLoadingComponent = () => {
    if (this.mounted) this.setState({ loadingComponent: false })
  }

  componentLoadMask = () => {
    return null
  }

  isLoading = () => {
    return this.props.app.loading || this.state.loadingComponent
  }

  renderLoadMask = () => {
    const { loadMasks, page } = this.props
    const Mask = loadMasks[page]
    const loading = this.isLoading()

    if (Mask) {
      return loading ? <Mask /> : null
    } else {
      return <LoadMask show={loading} fullscreen />
    }
  }

  errorView = ({ error }) => {
    const { classes } = this.props

    if (process.env.NODE_ENV === 'production') {
      let message

      if (error.message.match(/chunk/i)) {
        message = 'An new version of the app is available.  Reloading...'
      } else {
        message = 'An error occurred while attempting to load the page. Please try again later'
      }

      return (
        <Container>
          <Row>{message}</Row>
        </Container>
      )
    } else {
      return (
        <Container className={classes.error}>
          <pre>{error.stack}</pre>
        </Container>
      )
    }
  }

  onError = e => {
    if (e.message.match(/chunk/i)) {
      window.location.reload()
    }
  }
}
