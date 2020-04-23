const _ = require('lodash')
const streamErrorSlack  = require('../error-slack/index')

/**
 * {object} opts{ slack: Boolean, url: string, name: string }
 */
function apiResponse (req, res, opts) {

  if (!_.has(opts, 'url')) {
    throw new Error('url is required')
  }

  if (!_.has(opts, 'name')) {
    throw new Error('name is required')
  }

  const isSlackEnable = opts.slack || false
 
  // Handle redirect to...
  res.redirectTo = function (url) {
    if (isSlackEnable) {
      // Send log to slack
      streamErrorSlack(opts.url, {
        status: 200,
        name: opts.name,
        message: req.originalUrl,
        data: opts.url
      })
    }
    return res.redirect(url)
  }

  // Handle only HttpStatus Code 200.
  res.ok = function (data) {
    if (isSlackEnable) {
      // Send log to slack
      streamErrorSlack(opts.url, {
        status: 200,
        name: opts.name,
        message: req.originalUrl,
        data: data
      })
    }
    // response
    return res.status(200).json({
      status: 200,
      data: data
    })
  }

  // error response
  res.error = function (error) {
    // handles unauthorized errors or not full filled
    if (_.includes([400, 401, 402, 403], error.status)) {
      if (isSlackEnable) {
        // Send log to slack
        streamErrorSlack(opts.url, {
          status: error.status,
          name: opts.name,
          message: req.originalUrl,
          data: error
        })
      }
      return res.status(error.status).json({
        status: error.status,
        message: error.message
      })
    } else {
      // handles not found errors
      if (error.name === 'AssertionError' || error.status === 404) {
        if (isSlackEnable) {
          // Send log to slack
          streamErrorSlack(opts.url, {
            status: 404,
            name: opts.name,
            message: req.originalUrl,
            data: error.message
          })
        }
        return res.status(404).json({
          status: 404,
          message: error.message
        })
      } else {
        if (isSlackEnable) {
          // Send log to slack
          streamErrorSlack(opts.url, {
            status: 500,
            name: opts.name,
            message: req.originalUrl,
            data: error.message
          })
        }
        // Unknown error
        return res.status(500).json({
          message: error.message
        })
      }
    }
  }
}

module.exports = apiResponse;
