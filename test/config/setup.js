const Enzyme = require('enzyme')
const EnzymeAdapter = require('enzyme-adapter-react-16')
const sleep = require('./sleep').default

// Setup enzyme's react adapter
Enzyme.configure({ adapter: new EnzymeAdapter() })

global.jsdom.reconfigure({
  features: {
    ProcessExternalResources: false,
  },
})

global.sleep = sleep
