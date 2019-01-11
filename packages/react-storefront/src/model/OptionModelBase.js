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
    image: types.maybe(types.string),
    /**
     * An accessbility label for the image.  If left blank, text will be used as the accesibility label.
     */
    alt: types.maybe(types.string),
    /**
     * A CSS color value to display when an image is not available
     */
    color: types.maybe(types.string),
    /**
     * The item price for the option.
     */
    price: types.maybe(types.number)
  })

export default OptionModelBase 