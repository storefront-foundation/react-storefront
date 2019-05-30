module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          browsers: '> 1%'
        },
        useBuiltIns: 'usage',
        forceAllTransforms: true,
        modules: false
      }
    ],
    '@babel/react'
  ],
  env: {
    test: {
      presets: [
        [
          '@babel/env',
          {
            targets: {
              browsers: '> 1%'
            },
            useBuiltIns: 'usage',
            forceAllTransforms: true
          }
        ],
        '@babel/react'
      ]
    },
    docs: {
      presets: [
        [
          '@babel/env',
          {
            targets: {
              node: 'current'
            }
          }
        ],
        '@babel/react'
      ]
    }
  },
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true
      }
    ],
    '@babel/plugin-transform-async-to-generator',
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true
      }
    ],
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties'
  ]
}
