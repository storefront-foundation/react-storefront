const documentation = require('documentation')
const get = require('lodash/get')

const parseComments = data => {
  return data.description
}

const parseParams = (data, properties = false) => {
  return data.map(item => {
    const param = {
      name: properties ? item.name.split('.').pop() : item.name,
      default: item.default,
      type: get(item.type, 'name') || get(item.type, 'expression.name')
    }

    if (item.description) {
      param.text = item.description
    }

    if (item.properties) {
      param.properties = parseParams(item.properties, true)
    }

    return param
  })
}

const parseExamples = data => {
  return (
    data &&
    data.map(item => {
      const param = {
        description: item.description
      }

      if (item.caption) {
        param.caption = item.caption
      }

      return param
    })
  )
}

const repairType = (type, params, returns) => {
  if (type !== 'function' && (params.length > 0 || returns.length > 0)) {
    return 'function'
  }

  return type
}

const getType = (type, kind) => {
  if (get(type, 'name')) {
    return get(type, 'name')
  }

  if (kind) {
    return kind
  }

  if (get(type, 'expression') && get(type, 'applications')) {
    return `${get(type, 'expression.name')}<${get(type, 'applications[0].name')}>`
  }
}

const parseInfo = (data, results, path, isMixed) => {
  const fileName = data.context.file
    .split('/')
    .pop()
    .replace(/\.[^/.]+$/, '')
  const isClassMember = !!data.memberof
  const type = getType(data.type, data.kind)
  const getName = name => (fileName === name ? 'default' : name)
  const name = getName(isClassMember ? data.memberof : data.name)
  const isDefault = name === 'default'
  const fullPath = !isMixed && isDefault ? path : `${path}/${name}`

  const comments = parseComments(data)
  const params = parseParams(data.params)
  const returns = parseParams(data.returns)
  const examples = parseExamples(data.examples)
  const importTemplate = isDefault ? `${data.name}` : `{ ${data.name} }`

  const exportsObject = {
    name: data.name,
    type: repairType(type, params, returns),
    async: !!data.async,
    generator: !!data.generator,
    comments: comments,
    examples: examples,
    params: params,
    returns: returns,
    import: !isClassMember ? `import ${importTemplate} from 'react-storefront/${path}'` : undefined,
    members: type === 'class' ? [] : undefined
  }

  if (results.exports[fullPath]) {
    results.exports[fullPath].members.push(exportsObject)
  } else {
    results.exports[fullPath] = exportsObject
  }

  if (isMixed && !isClassMember && !results.items.some(item => item.name === name)) {
    results.items.push({ name })
  }

  if (!isMixed && name !== 'default') {
    results.items.push({ name })
  }

  return results
}

export default async function moduleParser(filePath, importPath, exported = true) {
  const build = (await documentation.build(filePath, {
    shallow: true,
    documentExported: exported
  })).filter(item => !item.license && !item.private)
  const isJsDoc = item => (item.tags && item.tags.length) || item.description
  const isMixed = build.length > 1

  let results = { items: [], exports: {} }

  for (const file of build) {
    if (!isJsDoc(file)) {
      continue
    }

    parseInfo(file, results, importPath, isMixed)

    if (file.kind === 'class') {
      file.members.instance.filter(isJsDoc).forEach(member => {
        parseInfo(member, results, importPath, isMixed)
      })
    }
  }

  return results
}
