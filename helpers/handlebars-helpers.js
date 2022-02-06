const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
const currentYear = () => dayjs().year()
const relativeTimeFromNow = a => dayjs(a).fromNow()
const noImage = a => a || 'http://via.placeholder.com/300x300?text=No+Image'
const ifCond = function (a, b, options) {
  return a === b ? options.fn(this) : options.inverse(this)
}
module.exports = {
  currentYear,
  relativeTimeFromNow,
  noImage,
  ifCond
}
