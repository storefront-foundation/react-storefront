import fulfillAPIRequest from '../props/fulfillAPIRequest'
import createAppData from './utils/createAppData'

export default async function home(req) {
  return await fulfillAPIRequest(req, {
    appData: createAppData,
    pageData: () =>
      Promise.resolve({
        title: 'React Storefront',
        slots: {
          heading: 'Welcome to your new React Storefront app.',
          description: `
                <p>
                Here you'll find mock home, category, subcategory, product, and cart pages that you can
                use as a starting point to build your PWA.
              </p>
              <p>Happy coding!</p>
            `,
        },
      }),
  })
}
