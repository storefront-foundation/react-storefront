import getRoutes from './getRoutes'
import fs from 'fs'
import path from 'path'
import glob from 'glob'

// Depending on the context (local dev, serverless lambda), the page manifest
// file can be at different locations
const MANIFEST_PATHS = [
  path.join(process.cwd(), 'pages-manifest.json'),
  path.join(process.cwd(), '.next', 'server', 'pages-manifest.json'),
  path.join(process.cwd(), '.next', 'serverless', 'pages-manifest.json'),
]

export default function listRoutes() {
  let manifest

  if (process.env.NODE_ENV === 'production') {
    const manifestPath = MANIFEST_PATHS.find(path => fs.existsSync(path))

    /* istanbul ignore else */
    if (manifestPath) {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
    } else {
      throw new Error(`Could not find pages-manifests.json in ${MANIFEST_PATHS.join(' or ')}`)
    }
  } else {
    manifest = createDevelopmentPagesManifest()
  }

  return getRoutes(manifest)
}

/**
 * Creates the equivalent of pages-manifest.json in development.  Since
 * next.js incrementally compiles pages on demand in development, pages-manifest may
 * not have all of the pages until they are visited and thus cannot be used by useSimpleNavigation
 * reliably in development.
 */
function createDevelopmentPagesManifest() {
  const pages = glob.sync('pages/**/*.js', { cwd: process.cwd() })
  const manifest = {}

  for (let page of pages) {
    const route = page.replace(/^pages/, '').replace(/\.[^/]+$/, '')
    manifest[route] = page
  }

  return manifest
}
