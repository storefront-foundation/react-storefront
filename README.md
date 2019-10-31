# React Storefront - headless PWA for any eCommerce

<img src="https://d9hhrg4mnvzow.cloudfront.net/www.vuestorefront.io/280b19d0-logo-vs_0by02c0by02c000000.jpg"></img>

![version](https://img.shields.io/badge/node-v8.x-blue.svg)
![Branch stable](https://img.shields.io/badge/stable%20branch-master-blue.svg)
![Branch Develop](https://img.shields.io/badge/dev%20branch-develop-blue.svg)
<a href="https://slack.vuestorefront.io">![Branch Develop](https://img.shields.io/badge/community%20chat-slack-FF1493.svg)</a>

React Storefront is a standalone PWA storefront for your eCommerce, possible to connect with any eCommerce backend (through the API).

Crafted with ❤️ by <a href="https://moovweb.com">Moovweb</a> and developed with <a href="https://vuestorefront.io">Vue Storefront</a> team

## Ludicrous Speed

React Storefront goes the extra mile to squeeze speed out of every possible real and user perceived performance optimization including:
- Server Side Rendering
- Automatic AMP creation
- Predictive prefetching
- Code splitting
- Cache optimization
- Client data reuse
- Skeletons
- and more

Bottom Line: sub-second page loads that are unmatched in the industry!

## A Different Approach

React Storefront takes a bold new approach that values developer productivity so you can get more done in less time:

- No config -- download and start coding
- Opinionated framework that does the heavy lifting for you
- Unified code base that uses isomorphic Javascript across server, client, and CDN
- Generate AMP and PWA from a single code base
- Automatically guides developers into performance best practices
- Supports source maps for Chrome Debugger and Visual Studio Code

Vue Storefront is and always will be in the open source. Anyone can use and support the project, we want it to be a tool for the improvement of the shopping experience.

The project is in the **production ready** phase. Already supporting sites from 10M$+ to 1B$+ on production!

**We are looking for Contributors and Designer willing to help us in the solution development.**

PS: Check [StorefrontUI](https://github.com/DivanteLtd/storefront-ui/) - our UI library for eCommerce.

## See it in action

<table>
  <tbody>
    <tr>
      <td align="center" valign="middle">
        <a href="https://demo.storefrontcloud.io">
          <img
            src="https://divante.co/open-graph/vuestorefront/GitHub-Readme-Try-Demo.png"
            alt="B2C Theme demo"
            style="width: 100px;">
        </a>
      </td>
      <td align="left" valign="top">
        Try out our open demo and if you like it <strong>first give us some star on Github ★</strong> and then contact us on <a href="https://slack.reactstorefront.io">Slack</a> or via contributors@reactstorefront.io. <br /><br /> This demo site is connected to <a href="http://demo-magento2.vuestorefront.io">BigCommerce</a> with shopping carts and users synchronization so You can make an order (which unfortunately won't be shipped ;P). <br /><br />If You like to integrate your custom 3rd party backend please <a href="https://reactstorefront.io">do contact us</a>.
      </td>
    </tr>
  </tbody>
</table>

## How to get started?

You can create a local copy of the demo site using `create-react-storefront` to use as a starting point for your own site:

```
npm install -g create-react-storefront
create-react-storefront my-site
```

Check out [the source code of the demo site](https://github.com/DivanteLtd/react-storefront-boilerplate).

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

## Join the community on Slack

If you have any questions or ideas feel free to join our slack: https://vuestorefront.slack.com via [invitation link](https://join.slack.com/t/vuestorefront/shared_invite/enQtNTAwODYzNzI3MjAzLWFkZjc0YjVjODA1Y2I2MTdlNmM0NThjY2M5MzgzN2U2NzE4YmE2YzA4YTM0MTY3OWQzZjBhMjBlZDhmYjAyNGI)

## Roadmap

[Here](https://github.com/DivanteLtd/react-storefront/milestones) you can find the accepted roadmap for current milestone and what you can expect with next release.

## Documentation

The documentation is always THE HARDEST PART of each open source project! But we're trying hard :-) 
[Full Guides, API Documentation, and Examples](https://pwa.moovweb.com/)


## The business challenges

Vue Storefront was created to solve a set of key business challenges from the world of the shopping experience. Our goal for the application is to provide the solution with:

- The ultrafast front-end for the store - with the PWA approach we can now render the catalog of products within milliseconds;
- The endurance for traffic overloads on the store;
- The off-line shopping capabilities;
- The smooth shopping experience close to the user experience from the native mobile applications;
- The all-in-one front-end for desktop and mobile screens with no necessity for maintaining 3 or more applications for different touchpoints (web browser, Android, iOS etc.).
- Rapid development without architecture limitations.

## The technology


## Support us!

**React Storefront is and always will be Open Source, released under Apache2 Licence.**

Most of the core team members, RS contributors and contributors in the ecosystem do this open source work in their free time. If you use Vue Storefront for a serious task, and you'd like us to invest more time on it, you can donate the project! You can support us in various ways:

- **Contribute** - this is how the Core Team is supporting the project!
- **Evangelize** - tweet about us, take some speaking slot at tech conference etc.
- **Sponsor** - if you're doing serious business on RS maybe You would like to donate the project and put your logo in here?

This is how we will use the donations:

- Allow the core team to work on RS
- Thank contributors if they invested a large amount of time in contributing
- Support projects in the ecosystem that are of great value for users
- Infrastructure cost
- Fees for money handling

**If you would like to support us please just let us know: contributors@reactstorefront.io**

## Works best on Moovweb CDN

React Storefront runs best on <a href="https://moovweb.com">Moovweb XDN</a>
Moovweb provides a platform-as-a-service called the XDN (Experience Delivery Network) that is available for purchase. Features that are available for purchase are listed are tagged with "XDN" in the table of contents

## Partners

Vue Storefront is a Community effort brought to You by our great Core Team and supported by the following companies.

Divanmte + Moovweb

Partners are encouraged to support the project in various ways - mostly by contributing the source code, marketing activities, evangelizing and of course - implementing the production projects. We do support our partners by dedicated contact channels, workshops and by sharing the leads from merchants interested in implementations.

If you like to become our Partner just let us know via contributors@reactstorefront.io.


## The license

Vue Storefront source code is completely free and released under the [Apache2 License](https://github.com/DivanteLtd/react-storefront/blob/master/LICENSE).

## Changelog

With any new Pull Request please make sure you've updated the [CHANGELOG file](CHANGELOG.md).

