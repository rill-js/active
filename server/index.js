'use strict'

var NAMESPACE = '@rill/active'
var domain = require('domain')
var prop = require('dot-prop')

/*
 * Expose middleware that keeps track of current context.
 * (Uses async-listener to keep track of continuation local storage).
 */
module.exports = exports = function () {
  return function activeMiddleware (ctx, next) {
    return new Promise(function (resolve) {
      var d = domain.create()
      d[NAMESPACE] = ctx
      d.add(ctx.req.original)
      d.add(ctx.res.original)
      d.run(function () { resolve(next()) })
    })
  }
}

// Expose namespace.
exports.namespace = NAMESPACE

/**
 * Get a value off of the current request context.
 */
exports.get = function (key, alt) {
  return prop.get(getCtx(), key, alt)
}

/**
 * Check if a value exists on the current request context.
 */
exports.has = function (key) {
  return prop.has(getCtx(), key)
}

/**
 * Set a value on the current request context.
 */
exports.set = function (key, val) {
  return prop.set(getCtx(), key, val)
}

/**
 * Returns the active context in domain.active
 */
function getCtx () {
  var ctx = domain.active && domain.active[NAMESPACE]
  if (!ctx) throw new Error('@rill/active: No active request running, could not retreive context.')
  return ctx
}
