import { mount as originalMount, ReactWrapper } from 'enzyme'

// Ugly patch based on https://github.com/emotion-js/emotion/issues/2553

ReactWrapper.prototype.patchedFind = function() {
  return this.find(...arguments)
    .children()
    .last()
    .children()
    .last()
}

export { originalMount as mount }