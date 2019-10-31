
# How to Contribute

Already a JS/Vue.js developer? Pick an issue, push a PR and instantly become a member of the vue-storefront contributors community.
We've marked some issues as "Easy first pick" to make it easier for newcomers to begin!

Thank you for your interest in, and engagement!

## How to?

To contribute to react-storefront:

1. Make a branch from `master`
2. Make your changes
3. Add tests
4. Verify all tests pass by running `yarn test`
5. Add an item to the Change Log in readme.md. Use your best judgement as to whether your change is a patch, minor release, or major release. We'll ensure that the correct version number is assigned before it is released.
6. Create a PR.

## Issue reporting guidelines:

Always define the type of issue:
* Bug report
* Feature request

While writing issues, be as specific as possible
All requests regarding support with implementation or application setup should be sent to contributors@vuestorefront.io

**Tag your issues properly**. If you found a bug tag it with `bug` label. If you're requesting new feature tag it with `feature request`  label.

## Pull request Checklist

Here’s how to submit a pull request. <b>Pull request that don't meet these requirements will not be merged.</b>

**ALWAYS** use [Pull Request template](https://github.com/DivanteLtd/react-storefront/blob/master/PULL_REQUEST_TEMPLATE.md) it's automatically added to each PR.
1. Fork the repository and clone it locally fro the 'develop' branch. Make sure it's up to date with current `develop` branch
2. Create a branch for your edits. Use the following branch naming conventions:
 * bugfix/task-title
 * feature/task-name
3. Use Pull Request template and fill as much fields as possible to describe your solution.
4. Reference any relevant issues or supporting documentation in your PR (ex. “Issue: 39. Issue title.”).
5. If you are adding new feature provide documentation along with the PR. Also, add it to [upgrade notes](https://github.com/DivanteLtd/vue-storefront/blob/master/doc/Upgrade%20notes.md)
6. If you are removing/renaming something or changing its behavior also include it in [upgrade notes](https://github.com/DivanteLtd/vue-storefront/blob/master/doc/Upgrade%20notes.md)
7. Test your changes! Run your changes against any existing tests and create new ones when needed. Make sure your changes don’t break the existing project. Make sure that your branch is passing Travis CI build. 
8. If you have found a potential security vulnerability, please DO NOT report it on the public issue tracker. Instead, send it to us at contributors@vuestorefront.io. We will work with you to verify and fix it as soon as possible.

## Acceptance criteria

Your pull request will be merged after meeting following criteria:
- Everything from "Pull Request Checklist"
- PR is proposed to appropriate branch 
- There are at least two approvals from core team members
