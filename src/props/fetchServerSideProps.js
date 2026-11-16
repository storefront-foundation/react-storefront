import fetch from '../fetch'
import getAPIURL from '../api/getAPIURL'
import getAPIHost from '../api/getAPIHost'

export default function fetchServerSideProps({ req, resolvedUrl }) {
  const host = getAPIHost(req)

  const protocol =
    host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http://' : 'https://'

  let uri = getAPIURL(resolvedUrl)

  if (uri.indexOf('?') === -1) {
    uri += '?_includeAppData=1'
  } else {
    uri += '&_includeAppData=1'
  }

  const headers = {
    host: req.headers.host,
    'x-next-page': `/api${resolvedUrl.split('?')[0].replace(/\/$/, '')}`,
    cookie: req.headers.cookie,
  }

  const url = `${protocol}${host}${uri}`

  return fetch(url, { credentials: 'include', headers })
    .then(res => res.json())
    .then(props => ({ props }))
}
