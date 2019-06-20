/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
export default function powerLinkHandler(_params, request, response) {
  response.set('content-type', 'application/javascript')

  const src = `${request.protocol}//${request.hostname}${
    [80, 443].indexOf(request.port) === -1 ? ':' + request.port : ''
  }`

  response.set('x-moov-cache', 'true')
  response.set('cache-control', `max-age: ${60 * 60 * 24}, s-maxage: ${60 * 60 * 24 * 365}`)

  response.send(`
    var links = Array.from(document.querySelectorAll('a[data-rsf-power-link]')).map(function(link) {
      var powerlink = link.getAttribute('href');
      powerlink += (powerlink.indexOf('?') === -1 ? '?' : '&') + 'powerlink'
      link.setAttribute('href', powerlink);
      return link.getAttribute('href')
    });

    var el = document.createElement('iframe');

    el.setAttribute('src', '${src}/pwa/install-service-worker.html?preload=' + encodeURIComponent(JSON.stringify(links)));
    el.setAttribute('style', 'height:1px;width:1px;');
    el.setAttribute('frameborder', '0');
    
    document.body.appendChild(el);
  `)
}
