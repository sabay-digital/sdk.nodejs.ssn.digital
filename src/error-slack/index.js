var Slack = require('slack-node');
var { extend, isEmpty } = require('lodash');

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

  const attachment = extend({}, {
    fallback: `${Error.name}: ${Error.message}`,
    color: (Error.status < 500) ? 'warning' : 'danger',
    title: `${Error.name}: ${Error.message}`,
    text: [
      { title: 'Stack', code: Error.stack },
      { title: 'Response', code: Error.response ? (Error.response.data || Error.response) : Error },
    ].map(data => createCodeBlock(data.title, data.code)).join(''),
    mrkdwn_in: ['text'],
    footer: 'ssn-stream-error-slack',
    ts: parseInt(Date.now() / 1000)
  })

  slack.webhook({ attachments: [attachment] }, (error) => { if (error) console.error(error) })
}

module.exports = streamErrorSlack;
