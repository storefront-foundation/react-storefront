/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */

import { types } from 'mobx-state-tree'

/**
 * Represents an image or a video.
 * @class MediaTypeModel
 */
export default types.model('MediaType', {
  src: types.string,
  alt: types.maybeNull(types.string),
  video: types.optional(types.boolean, false)
})
