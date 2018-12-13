module.exports = baseConfig => {
  baseConfig.resolve.alias = {
  	fetch: 'isomorphic-unfetch'
  }
  // Apply local show code plugin for example code generation
  console.log(JSON.stringify(baseConfig.module, null, 3));
	baseConfig.module.rules[0].query.plugins.push(require.resolve('./babel-plugin-show-code'));
  // Return the altered config
  return baseConfig
};
