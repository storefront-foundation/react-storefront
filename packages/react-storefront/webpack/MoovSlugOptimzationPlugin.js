const Template = require('webpack/lib/Template')

/**
 * A webpack plugin that optimizes slug performance by using the require cache injected into the sandbox.
 * This means that the slug does not need to be reparsed with each request.  The result of module execution
 * is also reused for multiple requests and this allows the JIT to optimize the slug.
 */
function MoovSlugOptimizationPlugin() {}

MoovSlugOptimizationPlugin.prototype.apply = function(compiler) {
  compiler.plugin("compilation", function(compilation) {
    compilation.mainTemplate.hooks.localVars.tap("MoovSlugOptimizationPlugin", (source, chunk, hash) => {
      return Template.asString([
        source,
        "// Use the module cache injected into the sandbox",
        "if (typeof global.__moov_require_cache !== 'undefined') installedModules = global.__moov_require_cache"
      ])
    })
  })
}

module.exports = MoovSlugOptimizationPlugin
