const moment = require('moment')

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
  toLocalDateTime,
  toLocalDate,
  now,
  today,
  chString,
  parseDate
};

