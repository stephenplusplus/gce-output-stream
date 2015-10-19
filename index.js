'use strict'

var format = require('string-format-obj')
var googleAuth = require('google-auto-auth')
var retryRequest = require('retry-request')
var split = require('split-array-stream')
var through = require('through2')

module.exports = function (cfg) {
  if (!cfg) throw new Error('Configuration object must be specified')
  if (!cfg.name) throw new Error('An instance name must be specified')
  if (!cfg.projectId) throw new Error('A projectId must be specified')
  if (!cfg.zone) throw new Error('A zone name must be specified')

  cfg.authConfig = cfg.authConfig || {}
  cfg.authConfig.scopes = ['https://www.googleapis.com/auth/compute']
  var authClient = cfg.authClient || googleAuth(cfg.authConfig)

  var outputStream = through({ encoding: 'utf8' })
  var outputLog = ''

  var reqOpts = {
    json: true,
    uri: format('https://www.googleapis.com/compute/v1/projects/{projectId}/zones/{zone}/instances/{name}/serialPort', cfg),
    qs: { port: cfg.port || 1 }
  }

  var refresh = function () {
    authClient.authorizeRequest(reqOpts, function (err, reqOpts) {
      if (err) return outputStream.destroy(err)

      retryRequest(reqOpts, function (err, resp, body) {
        if (body.error && body.error.errors && body.error.errors[0]) {
          var error = body.error.errors[0]
          err = new Error(error.message)
          err.response = resp.toJSON()
        }

        if (err) return outputStream.destroy(err)

        var newOutput

        if (outputLog) {
          newOutput = body.contents.replace(outputLog, '')
          outputLog += newOutput
        } else {
          outputLog = body.contents
          newOutput = body.contents
        }

        var logLines = newOutput.split('\r\n')

        split(logLines, outputStream, function (streamEnded) {
          if (!streamEnded) setTimeout(refresh, 250)
        })
      })
    })
  }

  refresh()

  return outputStream
}
