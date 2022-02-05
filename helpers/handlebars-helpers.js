const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
const currentYear = () => dayjs().year()
const relativeTimeFromNow = a => dayjs(a).fromNow()
const ifCond = function (a, b, options) {
  return a === b ? options.fn(this) : options.inverse(this)
}
module.exports = {
  currentYear,
  relativeTimeFromNow,
  ifCond
}
