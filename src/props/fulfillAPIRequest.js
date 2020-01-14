/**
 * Creates an API response that contains app level data only when ?_includeAppData=1 is present in the query string.
 * Otherwise the appData promise provided will not be resolved.
 *
 * @param {Request} req The request being served
 * @param {Object} options
 * @param {Function} options.appData An async function that returns a data for shared component in the app such as menu, nav, and footer
 * @param {Function} options.pageData An async function that return data for the page component
 * @return {Object} the result of appData and pageData merged into a single object.
 */
export default async function fulfillAPIRequest(req, { appData, pageData } = {}) {
  const promises = [pageData(req).then(pageData => ({ pageData }))]

  if (req.query._includeAppData === '1') {
    promises.push(appData(req).then(appData => ({ appData })))
  }

  const results = await Promise.all(promises)
  const data = {}

  for (let result of results) {
    Object.assign(data, result)
  }

  return data
}
