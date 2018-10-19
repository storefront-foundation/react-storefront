# React Storefront

Build and deploy e-commerce progressive web apps in record time.

[Full Guides, API Documentation, and Examples](https://pwa.moovweb.com/)

## License

All rights reserved.

## Changelog

### 4.1.0

 * Added `ProductModelBase.basePrice`
 * `ProductModelBase.price` is now a view that returns the `price` of the selected size or, if not present, the `basePrice`.
 * `ButtonSelector` can now display a CSS color code instead of an image via the new `color` field on `OptionModelBase`
 * `ButtonSelector` can now be configured to display a strike through when disabled by setting `strikeThroughDisabled`.  The angle can be controlled via `strikeThroughAngle`.

### 4.0.0

* Renamed to react-storefront and published on npmjs.org
* Routes now automatically fire pageView analytics events.  The `track` handler module has been removed
* The new `<Track>` component let's you track interactions with analytics declaratively.
* CommerceAnalyticsTarget and all subclasses have been moved to a separate package called 'moov-pwa-analytics'
* Many methods of CommerceAnalyticsTarget have a new signature.  All event methods now take a single options object.  Please check your calls to methods on `react-storefront/analytics` to make sure they match the updated signatures.
* Built in models in `react-storefront/model` no longer fire analytics events.  Analytics events are only fired front components.
* AMP analytics are now supported.

### 3.2.0

* You can now return state objects from `proxyUpstream` handlers to render the PWA.  Return null or undefined to render the proxied page.

### 3.1.0

* Skeletons are no longer fullscreen.  Pages remain hidden while `app.loading` is `true`, instead of being covered by the LoadMask/Skeleton.

### 3.0.0

* Pages now keeps one page of each type hidden in the DOM to make navigating back and forward much faster.  
* AppModelBase.applyState has been optimized to minimize rerendering of observer components.
* ResponsiveTiles has been optimized to render faster.

### 2.6

* Renamed Breadcrumbs component to BackNav.  It no longer tags an array of breadcrumbs, it now takes a single url and text.

* Created a new Breadcrumbs component for displaying multiple breadcrumbs.

### 2.5

* The request parameter passed to fromServer handlers has been refactored.  The "path" property has been deprecated in favor of separate "pathname" and "search" properties.
* Added a new `UpdateNotification` component that notifies the user when a new version of the app is available.
* The service worker will now only load HTML from the cache when coming from AMP or when launching from the homescreen.

### 2.4

* Adds the ability to reuse product thumbnails as the main product image in the PDP skeleton when navigating from PLP to PDP.

### 2.3.1

* Fixed `Link` bug which formatted URL's incorrectly
* Fixed issue where prefetched results are deleted when new SW is installed

### 2.3

* Added `SearchDrawer`, which replaces `SearchPopup`.

### 2.2

* You can now perfect proxy and transform pages from the upstream site using the new `proxyUpstream` handler. As a result, support for `requestHeaderTransform({ fallbackToAdapt: true })` has been removed.  Instead, simple add a `fallback(proxyUpstream())` handler to your router.

### 2.1

* Improved error handling with react-redbox and sourcemapped stacktraces for server-side errors
* Added react error boundary to catch errors while rendering and display a component stack trace.
* Automatically relay `set-cookie` headers from `fetch` calls to upstream APIs when not caching on the server.
* Added `fetchWithCookies` to automatically forward all cookies when calling upstream APIs.

### 2.0

* Support for moovsdk
* Refactored handler signature to `handler(params, request, response)`
* Renamed `ShowMoreButton` to `ShowMore` and added `infiniteScroll` prop
* Functionality for moov_edge_request_transform, moov_edge_response_transform, moov_request_header_transform, index, and moov_response_header transform are not standardized in `platform/*` modules.
* `moov-react-dev-server` is no longer needed
* new `ButtonSelector` component for color and size selections
* App state is automatically recorded in `window.history.state` so back and forward transitions are instantaneous.
* AMP Form POST is now supported and multipart encoded request bodies are parsed automatically.
* Added `Skeleton` components for creating custom loading skeletons

## Development

### Linking from Projects

To use your local copy of react-storefront when developing Moov PWA projects, in your clone of this repo, run:

```
yarn install
cd packages/react-storefront
yarn link
```

Then, in your project run:

```
yarn link react-storefront
```
