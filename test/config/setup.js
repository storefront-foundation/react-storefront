import Enzyme from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import sleep from './sleep'

// Setup enzyme's react adapter
Enzyme.configure({ adapter: new Adapter() })

global.jsdom.reconfigure({
  features: {
    ProcessExternalResources: false,
  },
})

global.sleep = sleep

process.env.RSF_APP_VERSION = 'v1'
