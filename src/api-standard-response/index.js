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
  const logLevel = opts.log_level || 'error'

  // Get request
  const fullRequest = { 
    host: req.protocol + '://' + req.get('host') + req.originalUrl, 
    headers: req.headers, 
    body: req.body 
  }
 
  // Handle render html...
  /**
   * {path to html} html
   * {any} data
   * {any} message
   */
  res.renderTo = function (html, data = null, message = null) {
    if (isSlackEnable && logLevel === 'info') {
      // Send log to slack
      streamErrorSlack(opts.url, {  
        status: 200,
        name: opts.name,
        message: fullRequest,
        data: message === null ? data : message
      })
    }
    if (data !== null) {
      return res.render(html, data)
    }
    return res.render(url)
  }
 
  // Handle redirect to...
  res.redirectTo = function (url) {
    if (isSlackEnable && logLevel === 'info') {
      // Send log to slack
      streamErrorSlack(opts.url, {
        status: 200,
        name: opts.name,
        message: fullRequest,
        data: opts.url
      })
    }
    return res.redirect(url)
  }

  // Handle only HttpStatus Code 200.
  res.ok = function (data) {
    if (isSlackEnable && logLevel === 'info') {
      // Send log to slack
      streamErrorSlack(opts.url, {
        status: 200,
        name: opts.name,
        message: fullRequest,
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
      if (isSlackEnable && logLevel === 'error') {
        // Send log to slack
        streamErrorSlack(opts.url, {
          status: error.status,
          name: opts.name,
          message: fullRequest,
          data: error
        })
      }
      return res.status(error.status).json({
        status: error.status,
        message: error.message ? error.message : error.title
      })
    } else {
      // handles not found errors
      if (error.name === 'AssertionError' || error.status === 404) {
        if (isSlackEnable && logLevel === 'error') {
          // Send log to slack
          streamErrorSlack(opts.url, {
            status: 404,
            name: opts.name,
            message: fullRequest,
            data: error.message ? error.message : error.title
          })
        }
        return res.status(404).json({
          status: 404,
          message: error.message ? error.message : error.title
        })
      } else {
        if (isSlackEnable && logLevel === 'error') {
          // Send log to slack
          streamErrorSlack(opts.url, {
            status: 500,
            name: opts.name,
            message: fullRequest,
            data: error.message ? error.message : error.title
          })
        }
        // Unknown error
        return res.status(500).json({
          message: error.message ? error.message : error.title
        })
      }
    }
  }
}

module.exports = apiResponse;
