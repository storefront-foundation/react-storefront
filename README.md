# React Storefront - the fastest, headless eCommerce PWA based on Next.js

<img src="https://divante.com/github/react-storefront/RSF.png" width="430px" ></img>

![version](https://img.shields.io/badge/node-v8.x-blue.svg)
![Branch stable](https://img.shields.io/badge/stable%20branch-master-blue.svg)
![Branch Develop](https://img.shields.io/badge/dev%20branch-develop-blue.svg)
<a href="https://slack.reactstorefront.io">![Branch Develop](https://img.shields.io/badge/community%20chat-slack-FF1493.svg)</a>

React Storefront (RSF) is a standalone responsive PWA storefront for your eCommerce websites that works with any eCommerce platform or backend system. React storefront extends Next.js to include everything you need for an eCommerce storefront. Try <a href="https://www.thetiebar.com/">The Tie Bar</a>, <a href="https://www.shopakira.com/">Akira</a>, and <a href="https://pwa.www.1800flowers.com/">1-800-FLOWERS.COM</a> on your phone to see how fast sites on RSF can be!

## Ludicrous Speed

React Storefront goes the extra mile to squeeze speed out of every possible real and user perceived performance optimization including:

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

<a href="https://demo.reactstorefront.io"><img src="https://divante.com/github/react-storefront/rsf-github.png" alt="Subsecond PWA now available for React devs"/></a>

## A Different Approach

React Storefront takes a bold new approach that values developer productivity so you can get more done in less time:

- No config -- download and start coding
- Opinionated framework that does the heavy lifting for you
- Unified code base that uses isomorphic JavaScript across the server, client, and CDN
- Generate AMP and PWA from a single code base
- Automatically guides developers into performance best practices
- Supports source maps for Chrome Debugger and Visual Studio Code

React Storefront is and always will be open source. Anyone can use and support the project, we want it to be a tool to improve the online shopping experience for everyone.

The project is in the **production ready** phase. Already supporting live retailer sites with 10M$ + to 1B$+ in annual eCommerce revenue!

**We are looking for Contributors and Designers willing to help us in the solution development.**

## See it in action

<table>
  <tbody>
    <tr>
      <td align="center" valign="middle">
        <a href="https://demo.reactstorefront.io">
          <img
            src="https://divante.com/github/react-storefront/rsf-github-try-demo.png"
            alt="B2C Theme demo"
            style="width: 100px;">
        </a>
      </td>
      <td align="left" valign="top">
        Try out our open demo and if you like it <strong>first give us some stars on GitHub ★</strong> and then contact with us on <a href="https://slack.reactstorefront.io">Slack</a> or via contributors@reactstorefront.io. <br /><br /> This demo site is connected to a BigCommerce demo instance. <br /><br />If You like to integrate your custom 3rd-party backend please <a href="https://reactstorefront.io">do contact us</a>.
      </td>
    </tr>
  </tbody>
</table>

## Integrations

React Storefront can be easily integrated with any eCommerce platform by [implementing the synthetic API](https://pwa.moovweb.com/guides/calling_apis). To make life easier we're preparing some out-of-the-box integrations. Currently we support **BigCommerce** out of the box. More platforms to come soon!

<a href="https://github.com/moovweb/BigCommerce"><img src="https://divante.com/github/react-storefront/rsf-github-bc-supported.png" alt="BigCommerce is officialy supported"/></a>

## How to get started?

You can create a local copy of the demo site using `create-react-storefront` to use as a starting point for your own site:

```
npm install -g create-react-storefront
create-react-storefront my-site
npm run start:express
```

<a href="https://pwa.moovweb.com">Read the Tutorial.</a>
Check out [the source code of the demo site](https://github.com/react-storefront-community/react-storefront-boilerplate).

## Development

If you like to contribute please feel free to **Raise an issue** with a bug or feature request report, or just open a **Pull Request** with the proposed changes. In any case [read the CONTRIBUTING.md first](./CONTRIBUTING.md)

Please feel invited to join our React Storefront Community!

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

If you have any questions or ideas feel free to join our slack: [invitation link](https://slack.reactstorefront.io)

## Roadmap

[Here](https://github.com/react-storefront-community/react-storefront/milestones) you can find the roadmap for current milestone and what you can expect with the next release.

Our short and mid-term plans include:

- adding alternative production build and deployment options,
- optimize the UI layer,
- long term plan - to port <a href="https://storefrontui.io">Storefront UI</a> to React and use it in the project.

## Documentation

The documentation is always THE HARDEST PART of each open source project! But we're trying hard :-)
[Full Guides, API Documentation, and Examples](https://docs.react-storefront.io/)

## The business challenges

React Storefront was created to solve a set of key business challenges from the world of the shopping experience. Our goal is to provide the following solutions:

- An ultrafast front-end for the store- with the PWA approach we can now render the catalog of products within milliseconds;
- Endurance for traffic overloads on the store;
- Off-line shopping capabilities;
- A smooth shopping experience, similar to that of a native mobile application;
- An all-in-one front-end for desktop and mobile devices with no necessity for maintaining 3 or more applications for different touchpoints (web browser, Android, iOS etc.).
- Rapid development without architecture limitations.

## Support us!

**React Storefront is and always will be Open Source, released under Apache2 Licence.**

Most of the core team members, React Storefront contributors and contributors in the ecosystem do this open source work in their free time. If you use React Storefront for a serious task, and you'd like us to invest more time on it, you can donate to the project! You can support us in various ways:

- **Contribute** - this is how the Core Team is supporting the project!
- **Evangelize** - tweet about us, take some speaking slot at tech conference etc.

**If you would like to support us please just let us know: contributors@reactstorefront.io**

## Try it on the XDN. Deploy it anywhere.

Like any Next.js project, React Storefront is deployable to any environment that runs Node.js. The easiest way to test drive and deploy React Storefront is on the <a href="https://www.moovweb.com">Moovweb Experience Delivery Network (XDN)</a>, a serverless PaaS that helps developers optimize speed across the entire stack to deliver dynamic websites that load in a blink of the eye. A free tier is available. Inquire through Moovweb's website.

## Partners

RSF was created by a group of eCommerce site, eCommerce agency, and eCommerce platform engineers.

Partners are encouraged to support the project in various ways - mostly by contributing to the source code, marketing activities, evangelizing and of course - implementing the production projects. We do support our partners by dedicated contact channels, workshops and by sharing the leads from merchants interested in implementations.

If you like to become our Partner just let us know via contributors@reactstorefront.io.

## The license

React Storefront source code is completely free and released under the [Apache2 License](https://github.com/react-storefront-community/react-storefront/blob/master/LICENSE).

## Changelog

With any new Pull Request please make sure you've updated the [CHANGELOG file](CHANGELOG.md).
