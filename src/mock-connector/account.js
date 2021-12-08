import fulfillAPIRequest from '../props/fulfillAPIRequest'
import createAppData from './utils/createAppData'

export default async function account(req) {
  return await fulfillAPIRequest(req, {
    appData: createAppData,
    pageData: () =>
      Promise.resolve({
        title: 'My Account',
        account: {},
        breadcrumbs: [
          {
            text: 'Home',
            href: '/',
          },
        ],
      }),
  })
}
