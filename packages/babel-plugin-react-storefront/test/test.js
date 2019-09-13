/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { Router, fromServer, proxyUpstream, state } from 'react-storefront/router'

function foo() {
  new Router()
    .get('/', page('Home'), fromServer('./home/home-handler'))
    .match('/', state('./home/home-handler'))
    .fallback(proxyUpstream('./adapt/handler'))
}
