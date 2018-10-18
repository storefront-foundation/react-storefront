/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
module.exports = {
  test: wrapper => wrapper && wrapper.debug,
  print: wrapper => wrapper.debug()
}
