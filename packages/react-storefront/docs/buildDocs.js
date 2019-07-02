#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const reactDocGen = require('react-docgen')
import getStylesCreator from '@material-ui/core/styles/getStylesCreator'
import createMuiTheme from '../src/createTheme'
import moduleParser from './moduleParser'
import globby from 'globby'

const RESOLVER = reactDocGen.resolver.findAllExportedComponentDefinitions
const COMPONENTS_PATH = path.join(__dirname, '../src')
const REACT_DOC_FILEPATH = path.join(__dirname, 'build/components.js')
const MODULE_DOC_FILEPATH = path.join(__dirname, 'build/modules.js')
const inheritedComponentRegexp = /\/\/ @inheritedComponent (.*)/

const theme = createMuiTheme()
const { execSync } = require('child_process')

function getInheritance({ src } = {}) {
  const inheritedComponent = src.match(inheritedComponentRegexp)

  if (!inheritedComponent) {
    return
  }

  const component = inheritedComponent[1]
  let pathname

  switch (component) {
    case 'Transition':
      pathname = 'https://reactcommunity.org/react-transition-group/#Transition'
      break

    case 'EventListener':
      pathname = 'https://github.com/oliviertassinari/react-event-listener'
      break

    default:
      pathname = `/components/${component}`
      break
  }

  return {
    component,
    pathname
  }
}

function getComponentName(filepath) {
  let name = path.basename(filepath)
  let ext
  while ((ext = path.extname(name))) {
    name = name.substring(0, name.length - ext.length)
  }
  return name
}

function readFileContent(file) {
  const filepath = path.resolve(COMPONENTS_PATH, file)
  const src = fs.readFileSync(filepath, 'utf8')
  const filename = getComponentName(filepath)
  return {
    id: filename,
    filepath,
    filename,
    importPath: path.join(path.dirname(file), path.basename(file, '.js')),
    src
  }
}

async function maybeParseModule(module) {
  try {
    if (module.filename !== 'index') {
      // Documentation.js can't parse models comments right with documentExported:true
      // that is why parsing model folder we put documentExported:false
      const isModel = module.importPath.split('/')[0] === 'model'
      const result = await moduleParser(module.filepath, module.importPath, !isModel)

      return Object.keys(result.exports).length === 0
        ? undefined
        : Object.assign({}, module, result, { component: false })
    }

    return undefined
  } catch {
    return undefined
  }
}

async function maybeParseReactComponent(componentObject) {
  try {
    const reactAPI = await reactDocGen.parse(componentObject.src, RESOLVER)[0]

    return Object.assign({}, componentObject, reactAPI, { component: true })
  } catch (error) {
    return await maybeParseModule(componentObject)
  }
}

function ignoreInternalComponents({ src } = {}) {
  return !(src.match(/@ignore - internal component\./) || src.match(/@ignore - do not document\./))
}

function isComponentParsed(x) {
  return !!x
}

function getStyles({ filename, filepath } = {}) {
  const styles = {
    classes: [],
    name: null
  }

  try {
    const component = require(filepath)

    if (component.styles && component.default.options) {
      // Collect the customization points of the `classes` property.
      styles.classes = Object.keys(getStylesCreator(component.styles).create(theme)).filter(
        className => !className.match(/^(@media|@keyframes)/)
      )
      styles.name = component.default.options.name
    }
  } catch (e) {
    console.warn(`Could not get styles from ${filename}.`)
  } finally {
    return styles
  }
}

function getProps({ props } = {}) {
  return Object.keys(props || [])
    .filter(prop => prop !== 'src')
    .map(propName => {
      return {
        name: propName,
        props: props[propName]
      }
    })
}

const main = async () => {
  console.log('\x1b[36m%s\x1b[0m', 'Building component docs...')
  const data = (await Promise.all(
    globby
      .sync(['**/*.js'], { cwd: COMPONENTS_PATH })
      .map(readFileContent)
      .map(maybeParseReactComponent)
  )).filter(isComponentParsed)

  const componentsData = data
    .filter(item => item.component)
    .filter(ignoreInternalComponents)
    .reduce((result, componentObject) => {
      const responseObject = { ...componentObject }

      responseObject.styles = getStyles(responseObject)
      responseObject.inheritance = getInheritance(responseObject)
      responseObject.props = getProps(responseObject)

      delete responseObject.filepath
      delete responseObject.component

      result[responseObject.filename] = responseObject

      return result
    }, {})

  const modulesData = data
    .filter(item => !item.component)
    .reduce(
      (result, componentObject) => {
        const { importPath, exports, item } = { ...componentObject }
        const root = importPath.split('/')[0]
        const isRootFile = root === importPath

        result.exports = Object.assign({}, result.exports, exports)

        if (isRootFile) {
          result.menu[root] = item

          return result
        }

        // Handle folders
        if (result.menu[root]) {
          result.menu[root].items.push(item)
        } else {
          result.menu[root] = { items: [item], text: root }
        }

        return result
      },
      { menu: {}, exports: {} }
    )

  const sortByText = (a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase())
  const sortItems = items => {
    items = items.sort((a, b) => sortByText(a, b))
    items = items.map(item => {
      if (item.items) {
        item.items = sortItems(item.items)
      }

      return item
    })

    return items
  }

  modulesData.menu = sortItems(Object.values(modulesData.menu))
  Object.keys(modulesData.exports).map(key => {
    if (modulesData.exports[key].members) {
      modulesData.exports[key].members = modulesData.exports[key].members.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      )
    }
  })

  saveJsFile(componentsData, REACT_DOC_FILEPATH)
  saveJsFile(modulesData, MODULE_DOC_FILEPATH)
}

main()

function saveJsFile(data, filepath) {
  const json = JSON.stringify(data)
  fs.writeFileSync(filepath, `const data = ${json};\nexport default data;`, 'utf8')
}
