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
 * @param {String | Number} selectedOption
 * @param {String | Number} currentOption
 * @param {Object} options
 * @return {String}
 */
function ifCond (selectedOption, currentOption, options) {
  return selectedOption === currentOption ? options.fn(this) : options.inverse(this)
}

exports = module.exports = {
  currentYear,
  relativeTimeFromNow,
  permissionType,
  defaultNavOption,
  ifCond
}
