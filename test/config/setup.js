import Enzyme from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import sleep from './sleep'

// Setup enzyme's react adapter
Enzyme.configure({ adapter: new Adapter() })

// After updating @mui/material, we have a lot of warnings caused by @emotion.
// They are of no value, as they do not affect the successful completion of tests.
// At the moment, I have turned off all these warnings, as they only hinder the development. 
// This can be removed in the future.
global.console = {
  log: console.log,
  error: jest.fn(),
  warn: jest.fn(),
  info: console.info,
  debug: console.debug,
};

global.jsdom.reconfigure({
  features: {
    ProcessExternalResources: false,
  },
})

global.sleep = sleep

process.env.RSF_APP_VERSION = 'v1'
