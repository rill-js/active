'use strict'

var prop = require('dot-prop')
var Zone = require('zone.js') && global.Zone

/*
 * Expose middleware that keeps track of current context.
 * (Uses zone.js to keep track of continuation local storage)
 */
module.exports = exports = function () {
  return function activeMiddleware (ctx, next) {
    return new Promise(function (resolve) {
      Zone.current.fork({
        name: '@rill/active',
        properties: { ctx: ctx }
      }).run(function () { resolve(next()) })
    })
  }
}

/**
 * Get a value off of the current request context.
 */
exports.get = function (key, alt) {
  return prop.get(Zone.current.get('ctx'), key, alt)
}

/**
 * Check if a value exists on the current request context.
 */
exports.has = function (key) {
  return prop.has(Zone.current.get('ctx'), key)
}

/**
 * Set a value on the current request context.
 */
exports.set = function (key, val) {
  return prop.set(Zone.current.get('ctx'), key, val)
}
