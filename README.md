# React Storefront

Build and deploy e-commerce progressive web apps (PWAs) in record time.

[Full Guides, API Documentation, and Examples](https://pwa.moovweb.com/)

# Example Site

[Example Site Built with React Storefront](https://react-storefront-boilerplate.moovweb.cloud)

You can create a local copy of this site using `create-react-storefront` to use as a starting point for your own site:

```
npm install -g create-react-storefront
create-react-storefront my-site
```

## License

React Storefront is licensed under the Apache 2.0 License.

## Contributing

To contribute to react-storefront:

1. Make a branch from `master`
2. Make your changes
3. Add tests
4. Verify all tests pass by running `yarn test`
5. Add an item to the Change Log in readme.md. Use your best judgement as to whether your change is a patch, minor release, or major release. We'll ensure that the correct version number is assigned before it is released.
6. Create a PR.

## Development

First, clone the repo and run yarn to install dependencies

```
yarn
```

To use your local copy of react-storefront when developing apps, in your clone of this repo, run:

```
yarn link:all
```

To automatically transpile your code when you make changes, run:

```
yarn watch
```

Then, in your app's root directory run:

```
npm link react-storefront && npm link babel-plugin-react-storefront && npm link react-storefront-moov-xdn && npm link react-storefront-middleware
```

### Setup prettier with Visual Studio Code

`prettier-vscode` can be installed using the extension sidebar.

To format on save, just update your `editor.formatOnSave` setting.

_For other editors, https://prettier.io/docs/en/editors.html_

## Publishing

To publish a release, run:

```
yarn release
```

## Changelog

### 6.57.0

- Removed css minification for non-amp request to speed up execution times.

### 6.56.0

- Added `DrawerButton` component for creating drawers with custom content with support for anchoring from any side
- `Lazy` no longer requires a `key` prop to automatically unmount it's children when the URL changes.

### 6.55.4

- Added `visibilitySensorProps` to `Lazy`.

### 6.55.3

- uninstall-service-worker.js is no longer prefetched.

### 6.55.2

- Elements inside `Lazy` are now shown in AMP.

### 6.55.1

- Search how hides and disables the submit button until the user enters a non-whitespace character
- Fixes hiding `<title>` tag when `app.title` is `null`

### 6.55.0

- Added `renderLeafHeader` and `renderLeafFooter` to `Menu`. These allow developers to customize the header and footer sections for non-root menu cards.
- Added `linkProps` prop to `HeaderLogo` for adding props into `Link` component.

### 6.54.3

- Updated `Image` to leave `src` in place when the image fails to load and `notFoundSrc` is not defined.
- Fixes on-screen keyboard collapsing when search field was cleared
- Fixes an issue where outdated state can be recorded in history if the app state changes immediately before navigation - [Issue #272](https://github.com/moovweb/react-storefront/issues/272)

### 6.54.2

- Fixed an issue where `<Image />` components with `lazy` parameter and no width are never rendered if they are initially above the fold.

### 6.54.1

- Improved consistency of prefetch caching.

### 6.54.0

- Upgrades workbox to 4.3.1
- Fixes a bug where prefetched data always results in a cache miss when navigating to a new page.

### 6.53.1

- Fixes a bug introduced in 6.47.0 that caused responses cached in the browser to not expire properly

### 6.53.0

- Added a `throttleClick` prop to `AddToCartButton` with a default of 250 milliseconds to help prevent users from adding a product to their cart multiple times by accident.
- Fixed the NavTabs storybook example.

### 6.52.2

- Improves the patch from 6.52.1 to also handle the case when the product was rendered on the server.

### 6.52.1

- Fixed a bug introduced in 6.52.0 where the product thumbnail shown over the main product images while loading would not be hidden when returning back to the same product as was previously viewed.

### 6.52.0

- Added AMP functionality to the `SearchDrawer`. In order to make the search drawer work in AMP:
  - Use the new `SearchButton` component in your app header to open the search drawer.
  - In your `search/suggest-handler.js`, add `thumbnails: (true|false)` to each item in groups. Set to `true` when items in the group have a thumbnail, otherwise `false`.

### 6.51.1

- The `renderers/render` method is now correctly marked `async`.

### 6.51.0

- `ImageSwitcher` now uses the product name for the `alt` prop on any images or thumbnails that do not have one.

### 6.50.2

- Fixed an issue where elements inside a `Lazy` component are never rendered if they are initially above the fold.

### 6.50.1

- Fixed error when running apps in express due to `headers.get(name)` not being defined.

### 6.50.0

- You can now add data to `amp-analytics` tags by implementing `getAmpAnalyticsData()` on analytics targets.
- Updated `Headers` implementation to support spreading, deleting, direct access of properties.
- Added woff2 support.

### 6.49.0

- `ImageSwitcher` can now display videos.
- Added a new `Video` component which supports displaying videos in AMP.
- Added a `fromOrigin(originName)` handler type that allows you to proxy an origin from the edge.
- Added a `redirectTo(path)` handler type that allows you redirect the request at the edge.

### 6.48.2

- Fixed AMP validation errors in `AmpImageSwitcher`.

### 6.48.1

- ImageSwitcher with color selector now works in AMP

### 6.48.0

- create-react-storefront now checks for node 8 at startup.

### 6.47.0

- Skeletons are now skipped when the URL matches a route that is cached on the client.

### 6.46.1

- Fixing AMP check in `Server`

### 6.46.0

- When `cache({ edge })` is present on a route and has a `key` property, the cookies in that key will be forwarded on any `fetch` calls sent upstream.
- Added `react-storefront/requestContext` for request scoped state storage access
- Redirects from AMP to the PWA if `@withAmp` is not present on the main page component or if `react-storefront-extensions/transformAmpHtml` is not used.
- Added the ability to disable analytics by setting a cookie named `rsf_disable_analytics` to `true`. The default smoke test now disables analytics so that smoke test runs aren't counted as real user sessions.

### 6.45.0

- Added tracking search events for the `SearchPopup` component

### 6.44.1

- `cache/clearClientCache` no longer requires the service worker to be installed in order to clear the cache. This is now done entirely by the main browser thread.

### 6.44.0

- Adds a new `react-storefront-puppeteer` package to help developers write puppeteer tests for React Storefront apps and schedule smoke testing with Moovweb Control Center.

### 6.43.2

- Fixed a client build issue relating to AMP exclusion.

### 6.43.1

- Prevent errors when headers forwarded by fetch are not provided by the browser.

### 6.43.0

- Added `BackToTop` component for scrolling to top of page.
- The `authorization` header sent from the browser will be forwarded to fetch calls made from the server when basic auth is enabled.

### 6.42.2

- Restored the default export of `react-storefront/fetch` for backwards compatibility.

### 6.42.1

- Restored `react-storefront/fetch` for backwards compatibility.

### 6.42.0

- The headers object included in fetch responses now matches the Headers interface from the standard fetch API.
- Fixes an issue where the `Menu` would not reset the user taps on an item to drill down.

### 6.41.0

- Adds the ability to clear the client cache using `clearClientCache()` from `react-storefront/cache`
- Added the ability to override the style of selected a NavTab via a new `selected` class.

### 6.40.0

- `fetch()` now relays the `user-agent` header from the browser if one is not explicitly provided.
- The `server` option in `cache()` route handlers has been renamed `edge`. Usage of `server` is still supported, but will result in a deprecation warning.

### 6.39.0

- Added the ability to split and normalize the server cache for routes using the `cache()` handler's new `server.key` property and `react-storefront/router/createCustomCacheKey`.

### 6.38.0

- Adding analytics events `searchSubmitted` and `searchLinkClicked` to SearchDrawer

### 6.37.1

- Fixed webpack production build issue

### 6.37.0

- `Server` now cleans and minifies server side rendered CSS
- `hydrate` now lives in utils. Used internally and for RSF components in adapt pages.

### 6.36.4

- Removes this warning about deprecated usage of `require("history/createBrowserHistory")`.

### 6.36.3

- `Server` now properly handle the case when rendering an error fails
- The app shell will no longer be throttled when prefetching.

### 6.36.2

- `SearchResultsModelBase` nows updates `facetGroups` if defined in a search results response

### 6.36.1

- Fixed `Filter` issue where all group items were being rendered even when not expanded
- Updated the `lodash` dependency to fix a vulnerability
- Fixed missing prefech flag header on prefetch requests.

### 6.36.0

- Added a `hideLast` prop to to the `Breadcrumbs` component.
- You can now disable the service worker by setting passing `serviceWorker: false` to `launchClient`.

### 6.35.1

- Sourcemap files are now excluded from the service worker precache manifest.

### 6.35.0

- Added `resetSelectionWhenImagesChange` prop to `ImageSwitcher`.
- `PageLink` now merges the `state` prop with state automatically created from the `model` prop.
- Added `optimize` prop on `Image` component which allows you to optimize images for mobile devices using Moovweb's CDN.

### 6.34.3

- Fixed prefetch throttling opt-in in production client webpack config.

### 6.34.2

- Fixed issues with lazy loading images in `CmsSlot`
- Fixed sizing of loading spinner in the `ShowMore` button so that it matches the button height

### 6.34.1

- Fixed warning "React does not recognize the lazyLoadImages prop on a DOM element." when using `CmsSlot`.

### 6.34.0

- Cookies are now sent with AJAX requests to get suggestions in the search drawer.
- Fixed an error that occurs in Link when `history` cannot be injected from app scope.
- Added `Lazy` component for late loading components with a simple wrapper
- `CmsSlot` now lazy loads images with `data-rsf-lazy` attribute

### 6.33.1

- Fixed linking to JS assets introduced in 6.33.0

### 6.33.0

- Added source maps for production builds.

### 6.32.0

- You can now lazy load items in the main menu by setting `lazyItemsURL` in `MenuItemModel` instances.
- You can now customize the rendering of menu items via Menu's `itemRenderer` and `itemContentRenderer` props.

### 6.31.1

- Fixes the "Uncaught TypeError: Converting circular structure to JSON" error shown in the console when the user clicks the `ShowMore` button.

### 6.31.0

- Adds a new `labelComponent` prop to `BackNav`, which allows you to override the default HTML element used to render the label.
- Fixes a bug where requests could be catched by `serviceWorker.cache(path)` even if the path matches a route that doesn't have a cache handler.
- Disable prefetching throttling by default.
- Improved service worker cache-busting by including settings in the hashed filename for the bootsrap file.

### 6.30.2

- Fixed deprecation warning: `Please use require("history").createMemoryHistory instead of require("history/createMemoryHistory")`

### 6.30.1

- `SearchDrawer` now handles a null value for `app.search.results` gracefully.

### 6.30.0

- Adds a `createSubmitURL` prop to `SearchDrawer`.
- You can now define a set of `initialGroups` to display in the search drawer when the search field is blank.
- Adds an `imageProps` prop to `ImageSwitcher`
- Adds support for accessing the app state tree with React's `useContext` hook via the new `react-storefront/AppContext`.
- Added a `withPersonalization` HOC and `usePersonalization` hook for late loading personalized data.

### 6.29.0

- Adds an `initialContent` prop to `SearchDrawer` that determines the content to display when the search field is blank.
- Fixed bug where custom `ExpandableSection` icons were showing wrong icon when using `defaultExpanded`.
- Fixed a bug where format was not being passed as a request param. This was introduced in 6.25.0
- Fixed bug in `renderers/render` which caused injection of PWA components into proxied pages to fail. This was a regression introduced in 6.26.0

### 6.28.0

- Adds a new `delayUntilInteractive` prop to `AnalyticsProvider` that delays loading analytics scripts until the app is fully interactive. This helps ensure the best TTI and user experience.

### 6.27.0

- Added `optimizeImages` util function for use in handlers
- Fixed issue with JS scripts being included in the wrong order during SSR in 6.26.0.

### 6.26.0

- JavaScript bundles are now prefetched using link rel="prefetch" headers.
- Fixes bug in handling of AMP routes introduced in 6.25.0

### 6.25.0

- The Router now explicitly adds a JSON route with each
  Route initialization
- Fixed max-age cache control header configuration

### 6.24.1

- Rerelease of 6.24.1 due to a botched build.

### 6.24.0

- You can now specify webpack `optimization` options in the client build config.
- You can now use the `OPEN_BROWSER` environment variable to control
  whether or not the browser opens after starting in development mode
- Added universal error reporting with the new `errorReporter` config on both `react-storefront/launchClient` and `react-storefront-moov-xdn/index`.

### 6.23.1

- Rolled back optimization to exclude AMP components in the client build that was added in 6.23.0 as it was causing issues in some apps.

### 6.23.0

- You can now pass options to control how Router's `applySearch` function stringifies params. For example, `router.applySearch({ colors: ['red', 'green'] }, { arrayFormat: 'brackets' })`
- AMP-specific components are now left out of the client build as they are only needed during server side rendering. This helps reduce client bundle size.
- The JSON that is cached by the service worker during the initial app load is now raw JSON returned from the router, not the serialized model. This brings it in line with how JSON returned from `fromServer` during client-side navigation is cached.

### 6.22.0

- The `Menu` component now looks the same when rendering in AMP and React.
- Fixed bug where links in the menu main were not rendered properly for SEO introduced in 6.16.0
- Fixes an issue where `ImageSwitcher` would not reset its `selectedIndex` after switching products.
- If an analytics target throws an error it will now be caught so that other targets have a chance to fire.

### 6.21.0

- Fixes UI styling in cases where the last breadcrumb is a link.
- Adds `sortProps` to `SortButton`, which allows your to pass props to the underlying `Sort` component.

### 6.20.0

- Added `serveSSRFromCache` option to the client webpack build. Set to `true` to allow the sevice worker to serve from the cache when a user initially lands on your app. Defaults to `false`.

- Fixed the padding of the close button in the `UpdateNotification` component.

### 6.19.0

- Improved `MenuIcon` with better animation. Note: MenuIcon's `OpenIcon` and `CloseIcon` props have been removed.

### 6.18.0

- Fetch now implements the standard `redirected` and `url` properties on the `Response` object. See https://developer.mozilla.org/en-US/docs/Web/API/Response#Properties.

### 6.17.0

- You can now define a surrogate key for each route using:

```js
new Router().get(
  '/p/:1',
  cache({
    server: {
      surrogateKey: (params, request) => {
        return 'product'
      }
    }
  }),
  fromServer('./path/to/handler')
)
```

- Fixed bug in converting relative URLs to absolute URLs in Link that was introduced in 6.16.0

### 6.16.1

- Updated mobx-react to correct peerDependency ^5.4.3

### 6.16.0

- Added `trackSelected` prop to `Menu`. Set to `true` to indicate the item corresponding to the current page
- Improved the performance of `Menu` by eliminating excessive rendering.

### 6.15.0

- New "PowerLinks" feature allows you link to a React Storefront app with `<a data-rsf-power-link="on" href="https://my.domain.com">Visit My Store</a>` and have the link prefetched and cached so that navigation is instant. Just add this to the site containing the link:

```js
<script src="http://my.domain.com/.powerlinks.js" defer />
```

- Added the ability to overwrite `cache()` route handler with `response.set('cache-control', '...')`.

### 6.14.1

- Fix bug in client webpack config due to a bad merge that would prevent apps from starting.

### 6.14.0

- Added support for prefetch throttling.

### 6.13.2

- Improved JSS class name generation in development

## 6.13.1

- Fixed a bug where links in the main menu were not rendered properly for SEO.

### 6.13.0

- Added `environment` module with `isClient` and `isServer` functions that allows you to detect whether your code is running on the client or the server.
- Stub out Response's `set`, `get`, `status`, `cookie`, and `redirect` methods on the client.

### 6.12.1

- Update peerDependencies for mobx, mobx-react, and mobx-state-tree to more stable versions.

### 6.12.0

- Improved offline support.
- Users will now be able to navigate back to any page they have previously visited when offline.
- The `AppBar` component now displays "Your device lost its internet connection" when offline. This message is configurable via AppBar's `offlineWarning` prop.
- Added an `Offline` component to be displayed as the main body of the app when the user attempts to navigate to a page that isn't cached when offline.
- Added `appShell` configuration method to `Router`. Configure the appShell with a `fromServer`handler that returns global data to display in the app shell when the user attempts to load the site while offline.

To add offline support to your app, upgrade to 6.12.0, then:

- Add an `appShell` configuration to your router definition:

```js
// src/routes.js

new Router()
  // ...
  .appShell(
    // returns only the global data needed to build the app-shell for offline support
    fromServer('./app-shell/app-shell-handler')
  )
```

- Add the `Offline` component to your `Pages` element in `App.js`.

```js
// src/App.js

import Offline from 'react-storefront/Offline'

// then in the render method...
class App extends Component {
  render() {
    return (
      <Pages
        components={universal => ({
          // ...
          Offline
        })}
      />
    )
  }
}
```

### 6.11.0

- Gracefully handle when `history.replace` fails due to the state object being too large. This was happening on Firefox for apps with large state trees as Firefox imposes a limit of 640kB on the state object. When history.replace fails, history.state will simply be cleared out and the app
  will get the state from the network if the user navigates back or forward.

### 6.10.0

- Removed `onImpression` from `Link`. We decided this logic was better handled in `CommerceAnalyticsTarget` in `react-storefront-extensions`.
- `AnalyticsProvider` now automatically calls `setHistory` for all targets.

### 6.9.2

- Fixed an issue with `Link` where `onImpression` would not fire if the user returns to a page using the back or forward buttons.

### 6.9.1

- Fixed an issue with `Link` where `onImpression` would not fire unless `prefetch="visible"` was also present

### 6.9.0

- Added support for `acceptInvalidCerts` option to `fetch`
- The `transform` passed into `react-storefront-moov-xdn/index` can now be asynchronous. The allows `react-storefront-extensions/transformAmpHtml` to fetch heights and widths for images when rendering AMP.
- Added `utils/batchPromises` for running batches of concurrent promises.
- Added `onImpression` prop to `Link` to help with tracking product impressions using `Track`.
- Added `currencyCode` to `ProductModelBase`

### 6.8.3

- Fixed a bug where a number shows in the `ImageSwitcher` component when rendered in AMP without thumbnails.

### 6.8.2

- Fixes an issue where images sometimes do not show up in `AmpImageSwitcher` due to a bug in `amp-carousel` when rendering in a div with `display: flex`. https://github.com/ampproject/amphtml/issues/14519
- Fixes styling differences when rendering `ExpandableSection` in AMP.
- Each card in the main menu now scrolls independently.
- `CmsSlot` now spreads props to the underlying `span`. This fixes an issue where `<Track>` would not fire events when a `CmsSlot` was the child element.

### 6.8.1

- Restored `AnalyticsProvider` accidentally removed in 6.8.0

### 6.8.0

- Removes unnecessary dependency on js-cookie.
- Added bottom border for selected thumbnail in AMP image carousel
- Added `className` to `MenuItemModel`. This allows you to add CSS class names to individual items in the Menu.

### 6.7.0

- Browsers that support source maps will now display original react-storefront source code when debugging.
- Changes to `Filter` and `FilterButton`:
  - adds `LoadMask` into `Filter`'s `facetGroups` block when model is loading
  - disables clear all button when model is loading
  - clear all button semantics fixed: use `<button>` instead `<a>` w/o `href` attribute
- Added AMP analytics when using AnalyticsProvider
- Added ability to pass amp-analytics attributes

### 6.6.2

- Handle `content-type: text/plain` in post bodies.

### 6.6.1

- Fixed posting from AMP when served from Google cache by adding the correct CORS headers.

### 6.6.0

- Fixed a bug where `ImageSwitcher`'s `thumbs` class is not applied when rendering AMP.
- Added customization props to `Rating`
- Added ability to add plugins to client webpack bundle
- Added `minimumTextLength` to `SearchModelBase`
- Added `AmpModal` component based on `<amp-lightbox>`.
- Added `AnalyticsProvider` for loading analytics on mount
- Fixes a layout issue with the `Drawer` component on iOS <= 10

### 6.5.0

- Removed extraneous logging of config on every request.
- `Menu` now renders children so you can add custom controls.
- Fixed a bug where an error would be thrown when posting application/json data with ESL enabled or posting an empty body.

### 6.4.0

- Added `name` prop to `QuantitySelector` to make it easier to submit the value when rendering AMP.
- Fixed a bug where multipart/form-data requests were not parsed properly.

### 6.3.0

- `fetch` now supports the `redirect` option with values `"follow"`, `"error"`, and `"manual"`.
- Added `x-rsf-routes` header to get available route information.

### 6.2.0

- Added `searchButtonVariant` and `showClearButton` props to `SearchDrawer` to give you greater control over the behavior of the search input.
- Fixes an issue where the page scrolls to the top when a route with a `proxyUpstream` handler runs on the client.
- Added `notFoundSrc` prop to `Image` component which will be used in case the primary image source fails to load
- TTF files are now processed by webpack file loader
- Fixed a bug where links were unresponsive until all JavaScript was fully loaded.

### 6.1.1

- Fixes a bug that resulted in an error from mst-middleware about rendering circular JSON when the user opens the main menu.

### 6.1.0

- `fetch` now supports inflating responses with `content-encoding: gzip`
- `<Track>` now allows you to map triggers to events. For example: `<Track trigger={{ onVisible: 'productShown', onClick: 'productClicked' }}>`
- `<Link>` now has a `onVisible` prop that you can use to be notified when a link is scrolled into the viewport.
- `withGlobalState(request, callback, localState)` now passes `request` to the `callback`.
- Removed proxy-polyfill, which was causing errors when using analytics in IE11. If you plan to support IE11 and use analytics, you must call `analytics.fire('eventName', data)` instead of the proxied methods like `analytics.eventName(data)`.

### 6.0.3

- Properly handle vendor chunks for components shared between pages.

### 6.0.2

- Fixed a bug causing the Filter component's apply button to be hidden on iOS.

### 6.0.1

- Corrected some out-of-date peerDependencies.

### 6.0.0

- Upgraded to mobx 4 and mobx-state-tree 3
- Upgraded to babel 7
- Upgraded to webpack 4
- Upgraded to material-ui@3.8.1

### 5.13.0

- Changes to `Filter` and `FilterButton`:
  - adds `LoadMask` into `Filter`'s `facetGroups` block when model is loading
  - disables clear all button when model is loading
  - clear all button semantics fixed: use `<button>` instead `<a>` w/o `href` attribute

### 5.12.1

- Fixes a layout issue with the `Drawer` component on iOS <= 10

### 5.12.0

- Added `AnalyticsProvider` for loading analytics on mount

### 5.11.0

- Added `AmpModal` component based on `<amp-lightbox>`.

### 5.10.2

- Fixed where links were unresponsive until all JavaScript was fully loaded.
- Removed extraneous console.log calls.

### 5.10.1

- Added `notFoundSrc` prop to `ImageSwitcher` and handle missing images before the app mounts.

### 5.10.0

- Added `searchButtonVariant` and `showClearButton` props to `SearchDrawer` to give you greater control over the behavior of the search input.
- Fixed an issue where the page scrolls to the top when a route with a `proxyUpstream` handler runs on the client.
- Added `notFoundSrc` prop to `Image` component which will be used in case the primary image source fails to load

### 5.9.0

- Removed proxy-polyfill, which was causing errors when using analytics in IE11. If you plan to support IE11 and use analytics, you must call `analytics.fire('eventName', data)` instead of the proxied methods like `analytics.eventName(data)`.

### 5.8.2

- Fixed a bug causing the Filter component's apply button to be hidden on iOS.

### 5.8.1

- Switch Webpack Bundle Analyzer to static mode so that analysis can be saved by CI

### 5.8.0

- Added a `state` field to `BreadcrumbModel` so that state can be passed to skeletons when the user clicks on a breadcrumb.
- Added support for setting bundle analyzer mode using `ANALYZER_MODE` env variable.

### 5.7.1

- Fixed case error with importing lodash/isFunction in Router.

### 5.7.0

- Added `cookie` helper method to `Response`
- Replaced regular `<iframe>` with `<amp-iframe>` when rendering AMP.
- Replaced YouTube `<iframe>` with `<amp-youtube>` when rendering AMP.
- Removed extra padding at the bottom of the Drawer component.
- Improved accessibility of QuantitySelector and ButtonSelector.

### 5.6.3

- Improved error handling for SSR.

### 5.6.2

- Fix layout issue with Filter title bar.
- Added warning for setting cookies on cached route

### 5.6.1

- Fix for production webpack builds with no options

### 5.6.0

- Fix errors in SearchResultModelBase when filtering after paging.
- Runs `yarn link:all` during CI builds to ensure that linking will work properly.
- Transition to PWA and open filter/sort from AMP.
- Added `variant="drawer|menu"` to `FilterButton`. The default is "`drawer`".

### 5.5.0

- Added `envVariables` to webpack server options
- Added ability to set asset path base

### 5.4.0

- Added `itemRenderer` prop to `Menu`

### 5.3.2

- Fixes an issue with Chrome 71 which prevents async loading of scripts by the service worker.

### 5.3.1

- Fix bugs related to production builds

### 5.3.0

- Code is now transpiled to ES5 before publishing
- Bundle size reduced by about 20%
- Can now run your build with an environment variable `ANALYZE=true` to see client build stats in your browser.

### 5.2.4

- Fixed a bug with sending redirects in response to POST requests from AMP.

### 5.2.3

- Prevents errors when webpack's OpenBrowserPlugin fails

### 5.2.2

- Fixed bug where all analytics targets would result in AMP event triggers being rendered, even if they don't support AMP.
- Removed some unused dependencies.

### 5.2.1

- Fixed vertical alignment of + / - icons in QuantiySelector

### 5.2.0

- You can now display the main menu on the right by setting `<AppBar menuAlign="right"/>` and `<Menu align="right"/>`.
- You can disable the "menu" label below the main menu button by setting `<AppBar menuIconProps={{ label: false }}/>`
- You can now provide a custom eslint config for webpack client and server builds.
- Fix bug where an empty popup would show when the user hovers over a NavTab without a menu on desktop.

### 5.1.1

- Fixed error when attempting to redirect from http to https.

### 5.1.0

- Added x-rsf-response-type and x-rsf-handler headers
- TabPanel's onChange prop no longer requires selected to be controlled.

### 5.0.4

- TabPanel is now controllable via a new `onChange` prop.
- Fixed bug in Container that would cause horizontal scrollbars to display on the window body.

### 5.0.3

- Fix CSS syntax error in LoadMask that could cause CSS not to load properly app-wide
- Reduce latency when serving static assets

### 5.0.2

- Corrected peerDependencies by adding "react-transition-group" and removing "react-css-transition-group"

### 5.0.1

- Improved performance of page transitions by setting `app.loading` to `true` in `PageLink` to eliminate a reconciliation cycle.
- The service worker now excludes mp4 videos from the catch-all runtime route to work around a known issue with videos and service workers in Safari.

### 5.0.0

- Upgrade to Material UI 3
- Improved responsive capabilities of many components
- NavTabs can now have menus
- Menu icon is now animated

### 4.10.1

- Added option to override selectedIndex in ImageSwitcher

### 4.10.0

- AMP analytics event data is now automatically generated based on configured targets.
- Added support for pageview events in AMP.
- Adds support for res.arrayBuffer() to react-storefront's internal fetch implementation. This allows developers to fetch binary data as a buffer.

### 4.9.0

- Prefetching now ramps up over the course of 25 minutes by default to ease the load on servers after clearing the cache during deployment

- Removes some assets from the precache manifest that don't need to be prefetched.

### 4.8.1

- You can now set a custom content-type using `response.set('content-type', contentType)`.

### 4.8.0

- You can now override `<meta>` tags using `react-helmet`.

- Now throws an error in development when a cache handler runs during non-GET request

- Removes set-cookie headers when route has a cache handler with server maxAgeSeconds > 0.

- Automatically caches all proxied images and fonts for a day

### 4.7.0

- ExpandableSection's expanded state can now be controlled via an expanded prop

### 4.6.2

- Fixed bug with Referrer-Policy header.

### 4.6.1

- Added Referrer-Policy: no-referrer-when-downgrade response header

### 4.6.0

- Added `response.json()` helper method for sending JSON data
- Fixed ShowMore infinity scrolling bug

### 4.5.1

- Added `X-Frame-Options: SAMEORIGIN` response header by default.

### 4.5.0

- `response.redirect(url, status)` no longer requires you to call response.send() afterwards.
- Fixed bug where `<Image lazy/>` and `<Link prefetch="visible"/>` elements would eager fetch when hidden by upgrading react-visibility-sensor.

### 4.4.2

- Fixed XXS vulnerability where code could be injected via the URL into the canonical link tag.

### 4.4.1

- Moved proxy-polyfill to dependencies.

### 4.4.0

- Static assets are now cached at the network edge.
- s-maxage is now only removed when there is no outer edge cache.

### 4.3.0

- Added `anchorProps` to Link
- Added analytics support for IE9+ via the addition of proxy-polyfill

### 4.2.0

- Added onSuccess prop to `Track`
- Prefetching now automatically resumes once page navigation is complete.

### 4.1.0

- Added `ProductModelBase.basePrice`
- `ProductModelBase.price` is now a view that returns the `price` of the selected size or, if not present, the `basePrice`.
- `ButtonSelector` can now display a CSS color code instead of an image via the new `color` field on `OptionModelBase`
- `ButtonSelector` can now be configured to display a strike through when disabled by setting `strikeThroughDisabled`. The angle can be controlled via `strikeThroughAngle`.

### 4.0.0

- Renamed to react-storefront and published on npmjs.org
- Routes now automatically fire pageView analytics events. The `track` handler module has been removed
- The new `<Track>` component let's you track interactions with analytics declaratively.
- CommerceAnalyticsTarget and all subclasses have been moved to a separate package called 'moov-pwa-analytics'
- Many methods of CommerceAnalyticsTarget have a new signature. All event methods now take a single options object. Please check your calls to methods on `react-storefront/analytics` to make sure they match the updated signatures.
- Built in models in `react-storefront/model` no longer fire analytics events. Analytics events are only fired front components.
- AMP analytics are now supported.

### 3.2.0

- You can now return state objects from `proxyUpstream` handlers to render the PWA. Return null or undefined to render the proxied page.

### 3.1.0

- Skeletons are no longer fullscreen. Pages remain hidden while `app.loading` is `true`, instead of being covered by the LoadMask/Skeleton.

### 3.0.0

- Pages now keeps one page of each type hidden in the DOM to make navigating back and forward much faster.
- AppModelBase.applyState has been optimized to minimize rerendering of observer components.
- ResponsiveTiles has been optimized to render faster.

### 2.6

- Renamed Breadcrumbs component to BackNav. It no longer tags an array of breadcrumbs, it now takes a single url and text.

- Created a new Breadcrumbs component for displaying multiple breadcrumbs.

### 2.5

- The request parameter passed to fromServer handlers has been refactored. The "path" property has been deprecated in favor of separate "pathname" and "search" properties.
- Added a new `UpdateNotification` component that notifies the user when a new version of the app is available.
- The service worker will now only load HTML from the cache when coming from AMP or when launching from the homescreen.

### 2.4

- Adds the ability to reuse product thumbnails as the main product image in the PDP skeleton when navigating from PLP to PDP.

### 2.3.1

- Fixed `Link` bug which formatted URL's incorrectly
- Fixed issue where prefetched results are deleted when new SW is installed

### 2.3

- Added `SearchDrawer`, which replaces `SearchPopup`.

### 2.2

- You can now perfect proxy and transform pages from the upstream site using the new `proxyUpstream` handler. As a result, support for `requestHeaderTransform({ fallbackToAdapt: true })` has been removed. Instead, simple add a `fallback(proxyUpstream())` handler to your router.

### 2.1

- Improved error handling with react-redbox and sourcemapped stacktraces for server-side errors
- Added react error boundary to catch errors while rendering and display a component stack trace.
- Automatically relay `set-cookie` headers from `fetch` calls to upstream APIs when not caching on the server.
- Added `fetchWithCookies` to automatically forward all cookies when calling upstream APIs.

### 2.0

- Support for moovsdk
- Refactored handler signature to `handler(params, request, response)`
- Renamed `ShowMoreButton` to `ShowMore` and added `infiniteScroll` prop
- Functionality for moov_edge_request_transform, moov_edge_response_transform, moov_request_header_transform, index, and moov_response_header transform are not standardized in `platform/*` modules.
- `moov-react-dev-server` is no longer needed
- new `ButtonSelector` component for color and size selections
- App state is automatically recorded in `window.history.state` so back and forward transitions are instantaneous.
- AMP Form POST is now supported and multipart encoded request bodies are parsed automatically.
- Added `Skeleton` components for creating custom loading skeletons
