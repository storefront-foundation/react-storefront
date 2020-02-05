#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
import { promisify } from 'util'

const readdir = promisify(fs.readdir)

const STORIES_PATH = path.join(__dirname, 'stories')
const METADATA_FILEPATH = path.join(__dirname, 'build/stories.json')

/**
 * Creates a JSON file containing all the storybook stories that are available in this format:
 * {
 *   ComponentName: ['story1', 'story2']
 * }
 */
const main = async () => {
  console.log('\x1b[36m%s\x1b[0m', 'Building storybook metadata...')
  const dirContents = await readdir(STORIES_PATH)
  const stories = {}

  dirContents.forEach(async file => {
    const contents = require(path.join(STORIES_PATH, file))
    stories[contents.default.title] = Object.keys(contents).filter(key => key !== 'default')
  })

  fs.writeFileSync(METADATA_FILEPATH, JSON.stringify(stories), 'utf8')
}

main()
