/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
const JSDOMEnvironment = require("jest-environment-jsdom");
const { merge } = require('lodash')

module.exports = class JSDOMEnvironmentGlobal extends JSDOMEnvironment {
  constructor(config) {

    super(merge(config, {
      testEnvironmentOptions: {
        runScripts: 'outside-only'
      }
    }))

    this.global.jsdom = this.dom;
  }

  teardown() {
    this.global.jsdom = null;
    return super.teardown();
  }
};