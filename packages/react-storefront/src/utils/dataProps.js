/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
/**
 * Returns an object containing the values from props corresponding to keys that start with "data-"
 * @param {Object} props 
 * @return {Object}
 */
export default function dataProps(props) {
  const result = {}

  for (let name in props) {
    if (name.startsWith('data-')) {
      result[name] = props[name]
    }
  }

  return result
}