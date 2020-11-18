# React Storefront the framework to build and deploy lightning-fast eCommerce PWAs.

Free and open-source. Built with Next.js

<img src="https://raw.githubusercontent.com/storefront-foundation/react-storefront/55aa994e3e5d40a2ebaa7b3ecd4c3423c703e72d/RSF%20Logo%20trans.png" width="430px" ></img>

![version](https://img.shields.io/badge/node-v8.x-blue.svg)
![Branch stable](https://img.shields.io/badge/stable%20branch-master-blue.svg)
![Branch Develop](https://img.shields.io/badge/dev%20branch-develop-blue.svg)
<a href="https://join.slack.com/t/react-storefront-comm/shared_invite/zt-hyq2dzxf-zUjcsxReDkJ6r1FR1xCnWw">![Branch Develop](https://img.shields.io/badge/community%20chat-slack-FF1493.svg)</a>

React Storefront (RSF) utilizes headless architecture allowing you to easily replace your legacy frontned and connect via APIs to any eCommerce platform or backend system. React Storefront extends Next.js to include everything you need for an eCommerce storefront. Try <a href="https://www.thetiebar.com/">The Tie Bar</a>, <a href="https://www.shopakira.com/">Akira</a>, and <a href="https://pwa.www.1800flowers.com/">1-800-FLOWERS.COM</a> on your phone to see how fast sites on RSF can be!

## Ludicrous Speed

React Storefront goes the extra mile to squeeze speed out of every possible real and user-perceived performance optimization including:

- High cache hit rates for dynamic data
- Server Side Rendering
- Automatic AMP creation
- Predictive prefetching of dynamic data
- Code splitting
- Cache optimization
- Client data reuse
- Skeletons
- and more

Bottom Line: RSF is built for speed!

## A Different Approach

React Storefront takes a bold new approach that values developer productivity, so you can get more done in less time:

- No config -- download and start coding
- Opinionated framework that does the heavy lifting for you
- Unified code base that uses isomorphic JavaScript across the server, client, and CDN
- Generate AMP and PWA from a single code base
- Automatically guides developers into performance best practices
- Supports source maps for Chrome Debugger and Visual Studio Code

React Storefront is and always will be open-source. Anyone can use and support the project. The goal of RSF is to improve the online shopping experience for everyone.

## Made to Sell

React Storefront is custom-built for eCommerce:. It contains UI components and templates designed for eCommerce. It’s SEO and search engine friendly. In addition, React Storefront allows you to preserve your existing URL Scheme.

## Built for Complex Sites

React Storefront scales from $10M to $1B+ revenue sites and is already powering leading enterprise eCommerce websites. The framework supports real-world migration of complex eCommerce sites to PWAs in incremental steps.

**We are looking for Contributors and Designers willing to help us in the solution development.**

## Integrations

React Storefront can be easily integrated with any [any eCommerce platform via APIs](https://docs.react-storefront.io/guides/api).

<img src="https://raw.githubusercontent.com/storefront-foundation/react-storefront/master/RSF%20power.png" alt="RSF- easy to use, powerful in action"/></a>

## Getting Started

To create a new React Storefront app, ensure node 10 or newer is installed and run:

```
npm create react-storefront@latest --yes (my-app-name)
```

Once your app has been created, you can start it in development mode by running:

```
cd (my-app-name)
npm run dev
```

[Developer Docs](https://docs.react-storefront.io)

## Development

If you like to contribute please feel free to **Raise an issue** with a bug or feature request report, or just open a **Pull Request** with the proposed changes.

## Local development

After cloning the repo, run:

```
npm i
```

To use your local clone of react-storefront in projects, use `yalc`.

To publish react-storefront to your local yalc store:

```
yalc publish
```

Then run the following to push updated builds to yalc store on changes.

```
npm run watch
```

Finally, in your project run:

```
yalc add react-storefront
```

This will change your project's package.json to use a file path in the dependency entry for react-storefront. To revert this change, run:

```
yalc remove react-storefront # or yalc remove --all
npm i
```

## Join the community on Slack

If you have any questions or ideas feel free to join our slack: [invitation link](https://join.slack.com/t/react-storefront-comm/shared_invite/zt-hyq2dzxf-zUjcsxReDkJ6r1FR1xCnWw)

## Documentation

The documentation is always THE HARDEST PART of each open-source project! But we're trying hard :-)
[Full Guides, API Documentation, and Examples](https://docs.react-storefront.io/)

**React Storefront is and always will be open-source, released under Apache2 Licence.**

## Try it on the XDN. Deploy it anywhere.

Like any Next.js project, React Storefront is deployable to any environment that runs Node.js. The easiest way to test drive and deploy React Storefront is on the <a href="https://www.moovweb.com/products/">Moovweb Experience Delivery Network (XDN)</a>, a serverless PaaS that helps developers optimize speed across the entire stack to deliver sub-second dynamic websites. A free tier is available. Inquire through Moovweb's website.

## Partners

RSF was created by a group of eCommerce site, eCommerce agency, and eCommerce platform engineers.

Partners are encouraged to support the project in various ways - mostly by contributing to the source code, marketing activities, evangelizing and of course - implementing the production projects. We do support our partners by dedicated contact channels, workshops and by sharing the leads from merchants interested in implementations.

[React Storefront logo and guidelines](https://github.com/storefront-foundation/react-storefront/blob/master/RSF%20BRANDGUIDE%20JPG.pdf)

## The license

React Storefront source code is completely free and released under the Apache2 License. For more details, check [LICENSE.md](LICENSE.md)
