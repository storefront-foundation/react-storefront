#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const reactDocGen = require('react-docgen')
const documentation = require('documentation')
import { createMuiTheme } from '@material-ui/core/styles'
import getStylesCreator from '@material-ui/styles/getStylesCreator'
import moduleParser from './moduleParser'
import globby from 'globby'

const RESOLVER = reactDocGen.resolver.findAllComponentDefinitions
const COMPONENTS_PATH = path.join(__dirname, '../src')
const REACT_DOC_FILEPATH = path.join(__dirname, 'build/components.js')

const theme = createMuiTheme()
// todo: remove when createTheme() is done
theme.zIndex.amp = { modal: 999 }

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
    name: filename,
    filepath,
    filename,
    importPath: path.join(path.dirname(file), path.basename(file, '.js')),
    src,
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

async function getStyles({ filename, filepath, src } = {}) {
  const styles = {
    classes: [],
    name: null,
  }

  try {
    const component = require(filepath)

    const docs = await documentation.build(filepath, {
      shallow: true,
    })

    if (component.styles && component.default) {
      const globalClassPrefixMatch = src.match(/makeStyles\(.*,\s*{\s*name:\s*'(.*)'\s*}\s*\)/)
      // Collect the customization points of the `classes` property.
      styles.classes = Object.keys(getStylesCreator(component.styles).create(theme))
        .filter(className => !className.match(/^(@media|@keyframes)/))
        .map(ruleName => {
          const styleDocs = docs.find(
            doc => doc.namespace === `.${ruleName}` && !doc.memberof.includes('.propTypes'),
          )
          return {
            ruleName,
            globalClass: globalClassPrefixMatch ? `.${globalClassPrefixMatch[1]}-${ruleName}` : '',
            description: styleDocs ? styleDocs.description : '',
          }
        })
      styles.name = component.default.name
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
        ...props[propName],
      }
    })
}

const main = async () => {
  console.log('\x1b[36m%s\x1b[0m', 'Building component docs...')
  const data = (
    await Promise.all(
      globby
        .sync(['**/*.js'], { cwd: COMPONENTS_PATH })
        .map(readFileContent)
        .map(maybeParseReactComponent),
    )
  ).filter(isComponentParsed)

  const addMenu = (result, isRootFile, root, menuItem) => {
    if (isRootFile) {
      result.menu[root] = menuItem

      return result
    }

    // Handle folders
    if (result.menu[root]) {
      result.menu[root].items.push(menuItem)
    } else {
      result.menu[root] = { items: [menuItem], text: root }
    }
  }

  const componentsData = await data
    .filter(item => item.component)
    .filter(ignoreInternalComponents)
    .reduce(async (result, componentObject) => {
      const responseObject = { ...componentObject }
      const fullPath = responseObject.filepath
        .replace(/.js$/, '')
        .substr(responseObject.filepath.indexOf('/src/') + 5)
      const splitPath = fullPath.split('/')
      const root = splitPath[0]
      const isRootFile = root === fullPath
      const menuItem = {
        text: splitPath[1] || fullPath,
        href: '/apiReference/[module]',
        as: `/apiReference/${encodeURIComponent(fullPath)}`,
      }

      responseObject.styles = await getStyles(responseObject)
      responseObject.props = getProps(responseObject)
      responseObject.type = 'component'
      responseObject.import = `import ${responseObject.filename} from 'react-storefront/${fullPath}'`

      delete responseObject.id
      delete responseObject.filepath
      delete responseObject.component

      const newPromise = await Promise.resolve(result)
      newPromise.exports[fullPath] = responseObject
      addMenu(newPromise, isRootFile, root, menuItem)

      return newPromise
    }, Promise.resolve({ menu: {}, exports: {} }))

  const modulesData = data
    .filter(item => !item.component)
    .reduce((result, componentObject) => {
      const { importPath, exports, item } = { ...componentObject }
      const root = importPath.split('/')[0]
      const isRootFile = root === importPath

      result.exports = Object.assign({}, result.exports, exports)
      addMenu(result, isRootFile, root, item)

      return result
    }, componentsData)

  const sortByText = (a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase())
  const sortItems = items => {
    items = items.sort((a, b) => sortByText(a, b))
    items = items.map(item => {
      if (item && item.items) {
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
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      )
    }
  })

  saveJsFile(componentsData, REACT_DOC_FILEPATH)
}

main()

function saveJsFile(data, filepath) {
  const json = JSON.stringify(data)
  fs.writeFileSync(filepath, `const data = ${json};\nexport default data;`, 'utf8')
}
