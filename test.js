'use strict'

var assert = require('assert')

var outputStream = require('./')

it('should throw if configuration is missing', function () {
  assert.throws(function () {
    outputStream()
  }, 'Configuration object must be specified')
})

it('should throw if an instance name is missing', function () {
  assert.throws(function () {
    outputStream({
      projectId: 'project-id',
      zone: 'zone-name'
    })
  }, 'An instance name must be specified')
})

it('should throw if a zone name is missing', function () {
  assert.throws(function () {
    outputStream({
      name: 'instance-name',
      projectId: 'project-id'
    })
  }, 'A zone name must be specified')
})

it('should get the output as a stream', function (done) {
  this.timeout(10000)

  outputStream({
    zone: 'us-central1-a',
    name: 'sillycloud',
    projectId: 'nth-circlet-705',
    authConfig: { credentials: require('./key.json') }
  })
  .on('error', done)
  .once('data', function (line) {
    assert.strictEqual(typeof line, 'string')
    this.end()
  })
  .on('end', done)
})

it('should return an error from the API response', function (done) {
  this.timeout(10000)

  outputStream({
    zone: 'us-central1-a',
    name: 'instance-name-that-doesnt-exist',
    projectId: 'nth-circlet-705',
    authConfig: { credentials: require('./key.json') }
  })
  .on('error', function (err) {
    assert.strictEqual(err.response.statusCode, 404)
    done()
  })
})
