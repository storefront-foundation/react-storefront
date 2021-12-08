import mergeWith from 'lodash/mergeWith'

/**
 * Deep merges sources onto object. The same as [`lodash/merge`](https://lodash.com/docs/4.17.15#merge),
 * except arrays are not concatenated.  When a source object provides an array, it replaces the value on the target.
 * @param {*} object
 * @param {...any} sources
 */
export default function merge(object, ...sources) {
  return mergeWith(object, ...sources, (_objValue, srcValue) => {
    if (Array.isArray(srcValue)) {
      return srcValue
    }
    return undefined
  })
}
