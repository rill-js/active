'use strict'

var NAMESPACE = '@rill/active'
var prop = require('dot-prop')
var Zone = require('zone.js') && global.Zone

/*
 * Expose middleware that keeps track of current context.
 * (Uses zone.js to keep track of continuation local storage)
 */
module.exports = function () {
  return function activeMiddleware (ctx, next) {
    return new Promise(function (resolve) {
      Zone.current.fork({}).run(function () {
        Zone.current[NAMESPACE] = ctx
        resolve(next())
      })
    })
  }
}

// Expose namespace.
module.exports.namespace = NAMESPACE

/**
 * Get a value off of the current request context.
 */
module.exports.get = function (key) {
  return prop.get(getContext(), key)
}

/**
 * Check if a value exists on the current request context.
 */
module.exports.has = function (key) {
  return prop.has(getContext(), key)
}

/**
 * Set a value on the current request context.
 */
module.exports.set = function (key, val) {
  return prop.set(getContext(), key, val)
}

/**
 * Pull the current context out of the current zone and warn if it is missing.
 */
function getContext () {
  var ctx = Zone.current[NAMESPACE]
  if (!ctx) console.warn('Could not retrieve context, no active request.')
  return ctx
}
