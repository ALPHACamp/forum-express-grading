const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

/**
 * @return {Date}
 */
function currentYear () {
  return dayjs().year()
}

/**
 * @param {Date} isAdmin
 * @return {String}
 */
function relativeTimeFromNow (createdAt) {
  return dayjs(createdAt).fromNow()
}

/**
 * @param {Boolean} isAdmin
 * @return {String}
 */
function permissionType (isAdmin) {
  return isAdmin ? 'admin' : 'user'
}

/**
 * @param {String | Number} selectedType
 * @param {String | Number} currentType
 * @return {String}
 */
const defaultNavOption = (selectedType, currentType) => {
  return selectedType === currentType ? 'active' : ''
}

/**
 * @param {String | Number} value1
 * @param {String} operator
 * @param {String | Number} value2
 * @param {Object} options
 * @return {String}
 */
function ifCond (value1, operator, value2, options) {
  switch (operator) {
    case '===':
      return value1 === value2 ? options.fn(this) : options.inverse(this)
    case '!==':
      return value1 !== value2 ? options.fn(this) : options.inverse(this)
  }
}

exports = module.exports = {
  currentYear,
  relativeTimeFromNow,
  permissionType,
  defaultNavOption,
  ifCond
}
