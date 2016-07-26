'use strict'

var NAMESPACE = '@rill/active'
var prop = require('dot-prop')
var createNamespace = require('continuation-local-storage').createNamespace
var ns = createNamespace(NAMESPACE)

/*
 * Expose middleware that keeps track of current context.
 * (Uses async-listener to keep track of continuation local storage).
 */
module.exports = function () {
  return function activeMiddleware (ctx, next) {
    ns.bindEmitter(ctx.req.original)
    ns.bindEmitter(ctx.res.original)
    return new Promise(function (resolve) {
      ns.run(function () {
        ns.set('ctx', ctx)
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
  return prop.get(ns.get('ctx'), key)
}

/**
 * Check if a value exists on the current request context.
 */
module.exports.has = function (key) {
  return prop.has(ns.get('ctx'), key)
}

/**
 * Set a value on the current request context.
 */
module.exports.set = function (key, val) {
  return prop.set(ns.get('ctx'), key, val)
}
