const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
module.exports = {
  currentYear: () => dayjs().year(),
  relativeTimeFromNow: t => dayjs(t).fromNow(),
  formatTime: t => dayjs(t).format('YYYY-MM-DD'),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
