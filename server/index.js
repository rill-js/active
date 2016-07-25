'use strict'

// TODO: warn on missing context
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
 * Pull the current context out of the current namespace and warn if it is missing.
 */
function getContext () {
  var ctx = ns.get('ctx')
  if (!ctx) console.warn('Could not retrieve context, no active request.')
  return ctx
}
