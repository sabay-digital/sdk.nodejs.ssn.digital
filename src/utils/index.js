var moment = require('moment');
var StellarSDK = require('stellar-sdk');

/**
 * @param {number} ms Default: 500
 * 
 * @returns {Promise}
 */
const promiseDelay = (ms = 500) => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

/**
 * @param {Function} fn 
 * @param {number} delay Default: 500ms
 * @param {number} limit  Default: 3 times
 * 
 * @returns {Promise}
 */
const promiseRetry = (fn, delay = 500, limit = 3) => {
  return new Promise((resolve, reject) => {
    return fn()
      .then(resolve)
      .catch(error => {
        if ((limit - 1) > 0) {
          return promiseDelay(delay)
            .then(promiseRetry.bind(null, fn, delay, limit - 1))
            .then(resolve)
            .catch(reject);
        }

        return reject(error);
      });
  });
};

/**
 * @param {string|null} datetime
 * 
 * @returns {string}
 */
const toLocalDateTime = (datetime = new Date()) => {
  datetime = moment(datetime).format('YYYY-MM-DD HH:mm:ss');

  return datetime;
}

/**
 * @param {string|null} datetime
 * 
 * @returns {string}
 */
const toLocalDate = (datetime = new Date()) => {
  datetime = moment(datetime).format('YYYY-MM-DD');

  return datetime;
}

/**
 * @returns {string}
 */
const now = () => {
  return toLocalDateTime();
}

/**
 * @returns {string}
 */
const today = () => {
  return toLocalDate();
}

/**
 * @param {string} value 
 * 
 * @returns {string}
 */
const chString = (value) => {
  return `'${value}'`;
};

/**
 * @param {*} date 
 * 
 * @returns {string|null}
 */
const parseDate = (date) => {
  return moment(new Date(date)).isValid() ? moment(date).format('YYYY-MM-DD') : null;
}

module.exports = {
  promiseDelay,
  promiseRetry,
  toLocalDateTime,
  toLocalDate,
  now,
  today,
  chString,
  parseDate
};

