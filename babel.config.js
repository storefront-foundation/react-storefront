module.exports = {
  presets: ['@babel/env', '@babel/preset-react'],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true,
      },
    ],
    [
      'babel-plugin-transform-imports',
      {
        '@mui/material': {
          transform: '@mui/material/${member}',
          preventFullImport: true,
        },
        '@mui/styles': {
          transform: '@mui/styles/${member}',
          preventFullImport: true,
        },
        '@mui/icons-material': {
          transform: '@mui/icons-material/${member}',
          preventFullImport: true,
        },
        '@mui/lab': {
          transform: '@mui/lab/${member}',
          preventFullImport: true,
        },
      },
    ],
    '@babel/plugin-proposal-class-properties',
  ],
}