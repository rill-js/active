'use strict'

var test = require('tape')
var agent = require('supertest').agent
var rill = require('rill')
var activeDomain = require('../server')
var activeZone = require('../client')

test('Sets active context between requests (Domains)', function (t) {
  t.plan(2)

  var request = agent(rill()
    .use(activeDomain())
    .get('/page1', function (ctx) {
      ctx.res.status = 200
      setTimeout(function () {
        t.equals(activeDomain.get('req.pathname'), '/page1', 'got right path')
      }, 100)
    })
    .get('/page2', function (ctx) {
      ctx.res.status = 200
      setTimeout(function () {
        t.equals(activeDomain.get('req.pathname'), '/page2', 'got right path')
      }, 50)
    })
    .listen().unref())

  // Request request both pages at the same time.
  request
    .get('/page1')
    .expect(200)
    .then(function () {}, t.fail)

  request
    .get('/page2')
    .expect(200)
    .then(function () {}, t.fail)
})

test('Sets active context between requests (Zone.js)', function (t) {
  t.plan(2)

  var request = agent(rill()
    .use(activeZone())
    .get('/page1', function (ctx) {
      ctx.res.status = 200
      setTimeout(function () {
        t.equals(activeZone.get('req.pathname'), '/page1', 'got right path')
      }, 100)
    })
    .get('/page2', function (ctx) {
      ctx.res.status = 200
      setTimeout(function () {
        t.equals(activeZone.get('req.pathname'), '/page2', 'got right path')
      }, 50)
    })
    .listen().unref())

  // Request request both pages at the same time.
  request
    .get('/page1')
    .expect(200)
    .then(function () {}, t.fail)

  request
    .get('/page2')
    .expect(200)
    .then(function () {}, t.fail)
})
