module.exports = baseConfig => {
  baseConfig.resolve.alias = {
  	fetch: 'isomorphic-unfetch'
  }
  // Apply local show code plugin for example code generation
	baseConfig.module.rules[0].query.plugins.push(require.resolve('./babel-plugin-show-code'));
  // Return the altered config
  return baseConfig
};
