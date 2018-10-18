/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { Router, fromClient, fromServer, proxyUpstream } from 'react-storefront/router'

function foo() {
  new Router()
    .get('/', 
      fromClient(params => ({ view: params.template })),
      fromServer('./home/home-handler')
    )
    .get('/', 
      fromServer('./home/home-handler', () => "foo")
    )
    .fallback(
      proxyUpstream('./adapt/handler')
    )
}
