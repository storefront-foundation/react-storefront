#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
import { promisify } from 'util'

const readdir = promisify(fs.readdir)

const STORIES_PATH = path.join(__dirname, 'stories')
const METADATA_FILEPATH = path.join(__dirname, 'build/stories.json')

// currently supported knob types:
const KNOB_FUNCS = ['text', 'select', 'boolean', 'number']
const knobHasOptions = funcName => ['select'].includes(funcName)

function generateKnobs(componentName, storyName, src) {
  const knobArray = []
  const fragmentRegex = new RegExp(
    `export const ${storyName}[\\s\\S]*(<${componentName}[\\s\\S]*>)`,
  )
  const srcFragment = (src.match(fragmentRegex) || [])[1] || ''
  // weird bug where component with no attributes doesn't match right; ignore it since it has no knobs
  if (srcFragment.startsWith(`<${componentName}>`)) {
    return knobArray
  }
  KNOB_FUNCS.forEach(knobFunc => {
    const knobRegexString = `\\s(.*?)={${knobFunc}\\(([\\s\\S]*?)\\)}`
    const knobMatches = srcFragment.match(new RegExp(knobRegexString, 'gm'))
    if (knobMatches) {
      knobMatches.forEach(matchStr => {
        const knobValue = eval(`[${matchStr.match(new RegExp(knobRegexString, 'm'))[2]}]`)
        knobArray.push({
          label: knobValue[0],
          defaultValue: knobValue[knobHasOptions(knobFunc) ? 2 : 1],
          type: knobFunc,
          options: knobHasOptions(knobFunc) ? knobValue[1] : undefined,
        })
      })
    }
  })
  return knobArray
}

/**
 * Creates a JSON file containing all the storybook stories that are available in this format:
 * {
 *   ComponentName: [
 *     {
 *       name: 'story1',
 *       knobs: [
 *         {
 *           label: 'Label',
 *           type: 'text',
 *           defaultValue: 'defaultValue'
 *         }
 *       ]
 *     }
 *   ]
 * }
 */
const main = async () => {
  console.log('\x1b[36m%s\x1b[0m', 'Building storybook metadata...')
  const dirContents = await readdir(STORIES_PATH)
  const stories = {}

  dirContents.forEach(async file => {
    const filepath = path.join(STORIES_PATH, file)
    const contents = require(filepath)
    const src = fs.readFileSync(filepath, 'utf8')
    if (contents.default) {
      const componentName = contents.default.title
      stories[componentName] = Object.keys(contents)
        .filter(key => key !== 'default')
        .map(storyName => ({
          name: storyName,
          knobs: generateKnobs(componentName, storyName, src),
        }))
    }
  })

  fs.writeFileSync(METADATA_FILEPATH, JSON.stringify(stories), 'utf8')
}

main()
