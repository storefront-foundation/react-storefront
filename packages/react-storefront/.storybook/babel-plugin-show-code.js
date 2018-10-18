function cleanSource(source) {
  return source
    .replace(/^observer\(/, '')
    .replace(/\)$/, '')
}

function createOptions(source) {
  return {
    type: 'ObjectExpression',
    properties: [{
      type: 'ObjectProperty',
      key: {
        type: 'Identifier',
        name: 'onBeforeRender'
      },
      value: {
        type: 'ArrowFunctionExpression',
        params: [],
        body: {
          type: 'StringLiteral',
          value: cleanSource(source)
        }
      }
    }]
  }
}

function getSourceElement(path) {
  const el = path.node.arguments[1].body;
  if (el.type === 'BlockStatement') {
    return el.body.find(n => n.type === 'ReturnStatement').argument;
  }
  return el;
}

/**
 * Babel plugin which copies the JSX used in the `addWithJSX` and uses it
 * for the rendered text.
 */
module.exports = function(babel) {
  const t = babel.types;
  return {
    visitor: {
      CallExpression: function(path, state) {
      	if (path.node.callee.property && path.node.callee.property.name === 'addWithJSX') {
          const el = getSourceElement(path);
          const source = state.file.code.substring(el.start, el.end);
      		path.node.arguments.push(createOptions(source));
      	}
      }
    }
  };
};
