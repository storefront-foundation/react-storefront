/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { types } from "mobx-state-tree"

const OptionModelBase = types
  .model("OptionModelBase", {
    /**
     * Used to identify the option.  This is the value sent to analytics.
     */
    id: types.maybe(types.string),
    /**
     * The string to display to the user
     */
    text: types.maybe(types.string),
    /**
     * Set to true to prevent the option from being selected
     */
    disabled: false,
    /**
     * A URL for an image to display
     */
    image: types.maybe(types.string)
  })

export default OptionModelBase 