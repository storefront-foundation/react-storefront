#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const reactDocGen = require('react-docgen');
import getStylesCreator from '@material-ui/core/styles/getStylesCreator';
import createMuiTheme from '../src/createTheme';
import globby from 'globby';

const RESOLVER = reactDocGen.resolver.findAllExportedComponentDefinitions;
const COMPONENTS_PATH = path.join(__dirname, '../src');
const DOC_FILEPATH = path.join(__dirname, 'build/components.js');
const inheritedComponentRegexp = /\/\/ @inheritedComponent (.*)/;

const theme = createMuiTheme();

function getInheritance({ src } = {}) {
  const inheritedComponent = src.match(inheritedComponentRegexp);

  if (!inheritedComponent) {
    return;
  }

  const component = inheritedComponent[1];
  let pathname;

  switch (component) {
    case 'Transition':
      pathname = 'https://reactcommunity.org/react-transition-group/#Transition';
      break;

    case 'EventListener':
      pathname = 'https://github.com/oliviertassinari/react-event-listener';
      break;

    default:
      pathname = `/components/${component}`;
      break;
  }

  return {
    component,
    pathname
  };
}

function getComponentName(filepath) {
  let name = path.basename(filepath);
  let ext;
  while ((ext = path.extname(name))) {
    name = name.substring(0, name.length - ext.length);
  }
  return name;
}

function readFileContent(file) {
  const filepath = path.resolve(COMPONENTS_PATH, file);
  const src = fs.readFileSync(filepath, 'utf8');
  const filename = getComponentName(filepath);
  return {
    id: filename,
    filepath,
    filename,
    importPath: path.join(path.dirname(file), path.basename(file, '.js')),
    src
  };
}

function maybeParseReactComponent(componentObject) {
  try {
    const reactAPI = reactDocGen.parse(componentObject.src, RESOLVER)[0];
    return Object.assign({}, componentObject, reactAPI);
  } catch (error) {
    return undefined;
  }
}

function ignoreInternalComponents({ src } = {}) {
  return !(
    src.match(/@ignore - internal component\./) ||
    src.match(/@ignore - do not document\./)
  );
}

function isComponentParsed(x) {
  return !!x;
}

function getStyles({ filename, filepath } = {}) {
  const styles = {
    classes: [],
    name: null
  };

  try {
    const component = require(filepath);

    if (component.styles && component.default.options) {
      // Collect the customization points of the `classes` property.
      styles.classes = Object.keys(getStylesCreator(component.styles).create(theme)).filter(
        className => !className.match(/^(@media|@keyframes)/)
      );
      styles.name = component.default.options.name;
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
    .map((propName) => {
      return {
        name: propName,
        props: props[propName]
      };
    });
}

const data = globby.sync(['**/*.js'], { cwd: COMPONENTS_PATH })
  .map(readFileContent)
  .map(maybeParseReactComponent)
  .filter(isComponentParsed)
  .filter(ignoreInternalComponents)
  .reduce((result, componentObject) => {
    console.log(componentObject.filename)
    componentObject.styles = getStyles(componentObject);
    componentObject.inheritance = getInheritance(componentObject);
    componentObject.props = getProps(componentObject);
    delete componentObject.filepath;
    result[componentObject.filename] = componentObject;
    return result
  }, {});

saveJsFile(data, DOC_FILEPATH);

function saveJsFile(data, filepath) {
  const json = JSON.stringify(data);
  fs.writeFileSync(filepath, `const data = ${json};\nexport default data;`, 'utf8');
}
