import Enzyme from 'enzyme'
import EnzymeAdapter from 'enzyme-adapter-react-16'
import sleep from './sleep'

// Setup enzyme's react adapter
Enzyme.configure({ adapter: new EnzymeAdapter() })

global.jsdom.reconfigure({
  features: {
    ProcessExternalResources: false,
  },
})

global.sleep = sleep
