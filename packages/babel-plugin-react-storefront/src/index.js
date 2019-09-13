/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
// replace all route handlers with fetch calls to moovjs
/*

For the server build, converts:

  import { Router, page, state } from 'react-storefront/router'

  new Router()
    .get('/', 
      page('Home'),
      state('./home/home-handler')
    )

... into ...

  import { Router, page, state } from 'react-storefront/router'
    
  new Router()
    .get('/',
      page('Home'),
      fromServer(function() {
        var handler = require('./home/home-handler').default;
        handler.path = './home/home-handler';
        return handler;
      })())
    )

*/
module.exports = function(babel) {
  const t = babel.types
  let declarations = new Set()

  return {
    visitor: {
      ImportDeclaration: function(path) {
        const { node } = path

        if (
          node.source &&
          node.source.type === 'StringLiteral' &&
          node.source.value === 'react-storefront/router'
        ) {
          node.specifiers.forEach(spec => {
            if (
              spec.imported &&
              ['fromServer', 'state', 'proxyUpstream'].includes(spec.imported.name)
            ) {
              declarations.add(spec.local)
            }
          })
        }
      },

      CallExpression: function(path) {
        const { node } = path

        if (!node.callee) return

        const toModify = path.scope.getBinding(node.callee.name)

        if (
          node.callee &&
          node.callee.type === 'Identifier' &&
          toModify &&
          declarations.has(toModify.identifier)
        ) {
          const arg = path.get('arguments')[0]

          if (arg) {
            arg.replaceWithSourceString(`
              (function() {
                var handler = require('${arg.node.value}').default;
                handler.path = '${arg.node.value}';
                return handler;
              })()
            `)
          }
        }
      }
    }
  }
}
