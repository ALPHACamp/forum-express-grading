const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
module.exports = {
  currentYear: () => dayjs().year(), // 取得當年年分
  isAdmin: function (value, options) {
    return value === 1 ? options.fn(this) : options.inverse(this)
  },
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  relativeTimeFromNow: a => dayjs(a).fromNow()
}
