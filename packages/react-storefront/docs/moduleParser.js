const documentation = require('documentation')
const flatten = require('lodash/flatten')
const get = require('lodash/get')

const extractValue = parent => {
  return flatten(
    parent.map(child => {
      if (child.value) {
        return child.value
      }

      return extractValue(child.children)
    })
  ).join('')
}

const parseComments = data => {
  return (
    data.description &&
    data.description.children
      .map(paragraph => {
        return paragraph.value || extractValue(paragraph.children)
      })
      .join('\n\n')
  )
}

const parseParams = data => {
  return data.map(item => {
    const param = {
      name: item.name,
      default: item.default,
      type: get(item.type, 'name') || get(item.type, 'expression.name')
    }

    if (item.description) {
      param.text = extractValue(item.description.children)
    }

    if (item.properties) {
      param.properties = parseParams(item.properties)
    }

    return param
  })
}

const parseInfo = (data, results, path, isMixed = false) => {
  const fileName = data.context.file
    .split('/')
    .slice(-1)
    .pop()
    .replace(/\.[^/.]+$/, '')
  const isClass = data.path[0].kind === 'class'
  const name = fileName === data.name && !isClass ? 'default' : data.name
  const type = get(data.type, 'name') || data.kind
  const comments = parseComments(data)
  const params = parseParams(data.params)
  const returns = parseParams(data.returns)
  const fullPath = isClass && !isMixed ? path : `${path}/${name}`
  const exportsObject = {
    name: name,
    type: type,
    async: !!data.async,
    generator: !!data.generator,
    comments: comments,
    params: params,
    returns: returns,
    members: type === 'class' ? [] : undefined
  }

  if (results.exports[fullPath]) {
    results.exports[fullPath].members.push(exportsObject)
  } else {
    results.exports[fullPath] = exportsObject
  }

  if (!isClass && !results.items.some(item => item.name === name)) {
    results.items.push({ name })
  }

  if (isMixed && isClass) {
    results.items.push({ name })
  }

  return results
}

export default async function moduleParser(filePath, importPath) {
  const build = (await documentation.build(filePath, {
    shallow: true,
    documentExported: true
  })).filter(item => !item.license && !item.private)
  const isJsDoc = item => (item.tags && item.tags.length) || item.description
  const isMixed = build.length > 1

  let results = { items: [], exports: {} }

  for (const file of build) {
    const isValid = !!file.path[0].kind

    if (!isValid || !isJsDoc(file)) {
      continue
    }

    parseInfo(file, results, importPath, isMixed)

    if (file.kind === 'class') {
      file.members.instance.filter(isJsDoc).forEach(member => {
        parseInfo(member, results, importPath)
      })
    }
  }

  return results
}
