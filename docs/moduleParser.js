const documentation = require('documentation')
const get = require('lodash/get')

// Take our own defined type if exists, then use documentation.js
const parseType = data => {
  const type = get(data, 'type')

  if (get(type, 'elements') && get(type, 'elements').length > 0) {
    return data.type.elements.map(el => el.name).join('|')
  }

  return get(type, 'name') || get(type, 'applications[0].name') || data.kind
}

const parseParams = (data, properties = false) => {
  return data.map(item => {
    const type = parseType(item)

    const param = {
      // options.App -> just App
      name: properties ? item.name.split('.').pop() : item.name,
      default: item.default,
      type: type || get(item.type, 'expression.name'),
      extendedType: type ? get(item.type, 'expression.name') : undefined,
    }
    if (item.description) {
      // console.log('description: ', item.description)
      param.text = item.description
    }

    if (item.properties) {
      param.properties = parseParams(item.properties, true)
    }

    return param
  })
}

const parseExamples = data => {
  return data.map(item => {
    const param = {
      description: item.description,
    }

    if (item.caption) {
      param.caption = item.caption
    }

    return param
  })
}

// Documentation.js treats arrow functions as type const
const repairType = (type, params, returns) => {
  if ((type === 'constant' || type === 'member') && (params.length > 0 || returns.length > 0)) {
    return 'function'
  }

  return type
}

const parseInfo = (data, results, path, hasNamedExports) => {
  const fileName = data.context.file
    .split('/')
    .pop()
    .replace(/\.[^/.]+$/, '')
  const isClassMember = !!data.memberof
  // If exported expression has the same name as file name we treat it as default export
  const getName = name => (fileName === name ? 'default' : name)
  const name = getName(isClassMember ? data.memberof : data.name)
  const isDefault = name === 'default'
  const fullPath = !hasNamedExports && isDefault ? path : `${path}/${name}`

  const comments = data.description
  const type = parseType(data)
  const params = parseParams(data.params)
  const returns = parseParams(data.returns)
  const examples = parseExamples(data.examples)
  const importTemplate = isDefault ? data.name : `{ ${data.name} }`

  const exportsObject = {
    name: data.name,
    type: repairType(type, params, returns),
    extendedType: get(data.type, 'expression.name'),
    async: !!data.async,
    generator: !!data.generator,
    comments: comments,
    examples: examples,
    params: params,
    returns: returns,
    import: !isClassMember ? `import ${importTemplate} from 'react-storefront/${path}'` : undefined,
    members: type === 'class' ? [] : undefined,
  }

  // Populate Class members
  if (results.exports[fullPath]) {
    results.exports[fullPath].members.push(exportsObject)
  } else {
    results.exports[fullPath] = exportsObject
  }

  const item = { text: name, url: fullPath }

  // Populate menu items
  if (hasNamedExports && !isClassMember) {
    results.items.push(item)
  }

  // When file has one export which is not default, Example: format/price.js
  if (!hasNamedExports && name !== 'default') {
    results.items.push(item)
  }
}

export default async function moduleParser(filePath, importPath, exported = true) {
  const fileName = importPath.split('/').pop()
  const build = (
    await documentation.build(filePath, {
      shallow: true,
      documentExported: exported,
    })
  ).filter(item => !item.license && !item.private)
  const isJsDoc = item => (item.tags && item.tags.length) || item.description
  // Check if the file we are processing have multiple exports, it is used for menu population
  // If it is true we will add the name to menu items
  const hasNamedExports = build.length > 1
  let results = { items: [], exports: {} }

  for (const file of build) {
    if (!isJsDoc(file)) {
      continue
    }

    parseInfo(file, results, importPath, hasNamedExports)

    if (file.kind === 'class') {
      file.members.instance.filter(isJsDoc).forEach(member => {
        parseInfo(member, results, importPath, hasNamedExports)
      })
    }
  }

  if (Object.keys(results.exports).length === 0) {
    return results
  }

  const haveItems = results.items && results.items.length

  const item = {
    text: fileName,
    href: haveItems ? undefined : '/[module]',
    as: haveItems ? undefined : `/${encodeURIComponent(importPath)}`,
    items: haveItems ? results.items : undefined,
  }

  return { item, exports: results.exports }
}
