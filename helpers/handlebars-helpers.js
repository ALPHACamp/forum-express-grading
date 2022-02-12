const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
const calendar = require('dayjs/plugin/calendar')
dayjs.extend(relativeTime)
dayjs.extend(calendar)

module.exports = {
  currentYear: () => dayjs().year(),
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  DateTime: a => dayjs(a).format('YYYY-MM-DD A hh:mm'),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
