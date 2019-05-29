/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import SearchReset from '@material-ui/icons/Clear'
import Typography from '@material-ui/core/Typography'
import { types } from 'mobx-state-tree'
import PropTypes from 'prop-types'
import Highlight from 'react-highlighter'
import CircularProgress from '@material-ui/core/CircularProgress'
import Link from './Link'
import { PropTypes as MobxPropTypes, inject, observer } from 'mobx-react'
import Image from './Image'

/**
 * A search popup with suggestions of search texts, categories, products.
 * can be used like composition
 * <SearchPopup>
 *   <SuggestedSearch />
 *   <CategorySearches />
 *   <ProductSuggestions />
 * </SearchPopup>
 */
export const styles = theme => ({
  searchPopup: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, .8)',
    zIndex: 9999,
    padding: '20px'
  },
  closeButton: {
    backgroundColor: theme.palette.white,
    border: `1px solid ${theme.palette.border}`,
    '& span': {
      textTransform: 'uppercase',
      fontWeight: 'bold'
    }
  },
  searchForm: {
    display: 'flex',
    marginTop: '20px',
    position: 'relative'
  },
  searchReset: {
    position: 'absolute',
    top: 0,
    right: '50px'
  },
  flexInput: {
    flexGrow: 1,
    backgroundColor: theme.palette.secondary.light,
    boxSizing: 'border-box',
    height: 48,
    padding: '8px 12px 8px 12px'
  },
  searchButton: {
    backgroundColor: theme.palette.darkButton,
    borderRadius: 0,
    '& svg': {
      fill: theme.palette.white
    }
  },
  suggestionHeader: {
    textTransform: 'uppercase',
    marginTop: '40px'
  },
  suggestionsList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    '& a strong': {
      fontWeight: 'bold',
      color: theme.palette.text.primary
    }
  },
  productImage: {
    height: '120px',
    width: '120px',
    display: 'block',
    marginBottom: '15px'
  },
  productsSuggestions: {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    overflowX: 'auto',
    '& > li': {
      margin: '5px'
    }
  },
  searchResultsWrapper: {
    position: 'absolute',
    top: '125px',
    bottom: 0,
    overflowY: 'auto',
    left: '20px',
    right: 0
  },
  loading: {
    paddingTop: '20%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

@withStyles(styles, { name: 'RSFSearchPopup' })
@inject(({ app: { searchPopup, search }, history }) => ({ searchPopup, search, history }))
@observer
export default class SearchPopup extends Component {
  state = {
    search: ''
  }

  static defaultProps = {
    suggestionResultsLimit: 3
  }

  static propTypes = {
    /**
     * searchPopup holds state of popup
     */
    searchPopup: PropTypes.shape({
      opened: PropTypes.bool.isRequired
    }),
    /**
     * search contains lists of suggestions
     */
    search: PropTypes.shape({
      searches: MobxPropTypes.arrayOrObservableArrayOf(
        PropTypes.shape({
          text: PropTypes.string
        })
      ),
      categories: MobxPropTypes.arrayOrObservableArrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          url: PropTypes.string,
          name: PropTypes.string
        })
      ),
      products: MobxPropTypes.arrayOrObservableArrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          url: PropTypes.string,
          name: PropTypes.string,
          image: PropTypes.string
        })
      )
    }),

    /**
     * limit for suggestion results list
     */
    suggestionResultsLimit: PropTypes.number,

    /**
     * Suggestion results components
     */
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,

    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    })
  }

  onChangeSearchText = text => {
    const { search } = this.props
    this.setState({ search: text })
    // only apply loading spinner if there is some text
    // in case of input clearing we rejecting previous requests so they won't fire loading flag reset
    // that's why we're doing this here
    search.setLoading(!!text)
    search.run(text)
  }

  hidePopup = () => {
    const { searchPopup } = this.props
    searchPopup.setIsPopupOpened(false)
    this.onChangeSearchText('')
  }

  onSearchSubmit = event => {
    const { history } = this.props
    event.preventDefault()
    history.push(`/search?text=${this.state.search}`)
    this.hidePopup()
  }

  render() {
    const { searchPopup, classes, search, children, suggestionResultsLimit } = this.props
    const searches = [...search.searches].splice(0, suggestionResultsLimit)
    const categories = [...search.categories].splice(0, suggestionResultsLimit)
    const results = React.Children.map(children, list =>
      React.cloneElement(list, {
        searches,
        classes,
        categories,
        products: search.products,
        searchText: this.state.search,
        hidePopup: this.hidePopup
      })
    )

    const loading = search.loading
    const contentReady = this.state.search && !loading

    return (
      <form
        onSubmit={this.onSearchSubmit}
        onReset={() => {
          this.onChangeSearchText('')
        }}
      >
        {searchPopup.opened && (
          <div className={classes.searchPopup}>
            <Button className={classes.closeButton} variant="contained" onClick={this.hidePopup}>
              Cancel
            </Button>
            <div className={classes.searchForm}>
              <Input
                type="text"
                className={classes.flexInput}
                value={this.state.search}
                onChange={e => {
                  this.onChangeSearchText(e.target.value)
                }}
              />
              <IconButton variant="contained" type="submit" className={classes.searchButton}>
                <SearchIcon />
              </IconButton>
              {this.state.search && (
                <IconButton type="reset" className={classes.searchReset}>
                  <SearchReset />
                </IconButton>
              )}
            </div>
            {loading && (
              <div className={classes.loading}>
                <CircularProgress />
              </div>
            )}
            {contentReady && <div className={classes.searchResultsWrapper}>{results}</div>}
          </div>
        )}
      </form>
    )
  }
}

const commonPropTypes = {
  hidePopup: PropTypes.func,
  classes: PropTypes.shape({
    suggestionHeader: PropTypes.string,
    suggestionsList: PropTypes.string
  })
}

/**
 * Search text suggestions
 * @param props
 * @constructor
 */
export const SuggestedSearch = props => (
  <React.Fragment>
    <Typography component="h2" className={props.classes.suggestionHeader}>
      Suggested search
    </Typography>
    <ul className={props.classes.suggestionsList}>
      {props.searches.map((item, i) => (
        <li key={i}>
          <Link to={`/search?text=${item.text}`} onClick={props.hidePopup}>
            <Highlight search={props.searchText}>{item.text}</Highlight>
          </Link>
        </li>
      ))}
    </ul>
  </React.Fragment>
)

SuggestedSearch.propTypes = {
  ...commonPropTypes,
  searches: MobxPropTypes.arrayOrObservableArrayOf(
    PropTypes.shape({
      text: PropTypes.string
    })
  ),
  searchText: PropTypes.string
}

/**
 * Search categories suggestions
 * @param props
 * @constructor
 */
export const CategorySearches = props => (
  <React.Fragment>
    <Typography component="h2" className={props.classes.suggestionHeader}>
      Category searches
    </Typography>
    <ul className={props.classes.suggestionsList}>
      {props.categories.map(item => (
        <li key={item.id}>
          <Link to={item.url} onClick={props.hidePopup}>
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  </React.Fragment>
)

CategorySearches.propTypes = {
  ...commonPropTypes,
  categories: MobxPropTypes.arrayOrObservableArrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      url: PropTypes.string,
      name: PropTypes.string
    })
  )
}

/**
 * Search products suggestions
 * @param props
 * @constructor
 */
export const ProductSuggestions = props => (
  <React.Fragment>
    <Typography component="h2" className={props.classes.suggestionHeader}>
      Product suggestions
    </Typography>
    <ul className={props.classes.productsSuggestions}>
      {props.products.map(item => (
        <li key={item.id}>
          <Link to={item.url} onClick={props.hidePopup} className={props.classes.productImage}>
            <Image fill src={item.thumbnail} alt={item.name} />
          </Link>
          <Link to={item.url} onClick={props.hidePopup}>
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  </React.Fragment>
)

ProductSuggestions.propTypes = {
  ...commonPropTypes,
  products: MobxPropTypes.arrayOrObservableArrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      url: PropTypes.string,
      name: PropTypes.string,
      thumbnail: PropTypes.string
    })
  )
}

/**
 * Search popup model
 */
export const SearchPopupModel = types
  .model('SearchPopupModel', {
    opened: types.boolean
  })
  .actions(self => ({
    setIsPopupOpened(status) {
      self.opened = status
      return self
    }
  }))
