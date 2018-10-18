module.exports = {
  extends: './eslint-client.js',
  globals: {
    fns: true,
    $: true,
    env: true,
    $body: true,
    $head: true,
    $html: true,
    body: true,
    tag: true,
    scoped$: true,
    $this: true,
    $root: true,
    sendResponse: true,
    headers: true,
    http: true,
    https: true
  }
}