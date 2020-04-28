var _ = require('lodash');

/**
 * Prefix `855` to phone number.
 * 
 * @param {string} phone 
 * 
 * @returns {string|null}
 */
const toPrefixWithEightFiveFive = (phone) => {
  const startWithPrefix = '855';
  const startWithPrefixLength = [11, 12];

  const startWithNoPrefix = '0';
  const startWithNoPrefixLength = [9, 10];

  const startWithNoZeroLength = [8, 9];

  if (_.startsWith(phone, startWithPrefix) && _.includes(startWithPrefixLength, _.size(phone))) {
    // phone is already prefixed with `855`, so just return it back
    return phone;
  }

  if (_.startsWith(phone, startWithNoPrefix) && _.includes(startWithNoPrefixLength, _.size(phone))) {
    // phone is not prefixed with `855`, now let's prefix it
    let prefixedPhone = phone.substring(1, _.size(phone));
    prefixedPhone = `855${prefixedPhone}`;

    return prefixedPhone;
  }

  if (!_.startsWith(phone, '0') && _.includes(startWithNoZeroLength, _.size(phone))) {
    return `855${phone}`;
  }

  return null;
};

/**
 * Replace `855` to `0`
 * 
 * @param {string} phone 
 * 
 * @returns {string|null}
 */
const toPrefixWithZero = (phone) => {
  const startWithNoPrefix = '0';
  const startWithNoPrefixLength = [9, 10];

  const startWithPrefix = '855';
  const startWithPrefixLength = [11, 12];

  const startWithNoZeroLength = [8, 9];

  if (_.startsWith(phone, startWithNoPrefix) && _.includes(startWithNoPrefixLength, _.size(phone))) {
    // phone is already prefixed with `0`, so just return it back
    return phone;
  }

  if (_.startsWith(phone, startWithPrefix) && _.includes(startWithPrefixLength, _.size(phone))) {
    // phone is prefixed with `855`, so let's replace it with `0`
    let prefixedPhone = phone.substring(3, _.size(phone));
    prefixedPhone = `0${prefixedPhone}`;

    return prefixedPhone;
  }

  if (!_.startsWith(phone, '0') && _.includes(startWithNoZeroLength, _.size(phone))) {
    return `0${phone}`;
  }

  return null;
}

module.exports = {
  toPrefixWithEightFiveFive,
  toPrefixWithZero
};
