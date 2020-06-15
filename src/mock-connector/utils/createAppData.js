import createMenu from './createMenu'
import createTabs from './createTabs'

export default function createAppData() {
  return Promise.resolve({ menu: createMenu(), tabs: createTabs() })
}
