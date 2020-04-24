var Slack = require('slack-node');
var { extend, isEmpty, includes } = require('lodash');

/**
 * @param {string} title 
 * @param {*} code 
 * 
 * @returns {string}
 */
function createCodeBlock(title, code) {
  if (isEmpty(code)) return '';

  code = (typeof code === 'string') ? code.trim() : JSON.stringify(code, null, 2);

  const tripleBackticks = '```';

  return `_${title}_${tripleBackticks}${code}${tripleBackticks}\n`;
}

/**
 * @param {string} slackWebHook 
 * @param {*} Error 
 * 
 * @returns {void}
 */
function streamErrorSlack(slackWebHook, Error) {
  const slack = new Slack();

  slack.setWebhook(slackWebHook);

  let level = 'good'
  let label = 'INFO'
  if (includes([400, 401, 402, 403, 404], Error.status)) {
    level = 'warning'
    label = 'WARNING'
  }

  if (Error.status >= 500) {
    level = 'danger'
    label = 'ERROR'
  }

  const attachment = extend({}, {
    fallback: `${Error.name}: ${Error.message}`,
    color: level,
    title: `${Error.name}\r\n${label}`,
    text: [
      { title: 'Stack', code: Error.stack },
      { title: 'Request:', code: Error.message },
      { title: 'Response:', code: Error.response ? (Error.response || Error.response.data) : ({ status: Error.status, data: Error.data } || Error) },
    ].map(data => createCodeBlock(data.title, data.code)).join(''),
    mrkdwn_in: ['text'],
    footer: 'ssn-stream-error-slack',
    ts: parseInt(Date.now() / 1000)
  })

  slack.webhook({ attachments: [attachment] }, (error) => { if (error) console.error(error) })
}

module.exports = streamErrorSlack;
