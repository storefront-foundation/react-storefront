import { skipWaiting, clientsClaim } from 'workbox-core'
import { precacheAndRoute } from 'workbox-precaching'
import { Prefetcher } from 'workbox-prefetch/sw'

skipWaiting()
clientsClaim()
precacheAndRoute(self.__WB_MANIFEST || [])

new Prefetcher().route()
