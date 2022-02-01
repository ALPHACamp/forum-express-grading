const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')

// Extend dayjs methods
dayjs.extend(relativeTime)

module.exports = {
  // Time
  currentYear: () => dayjs().year(),

  relativeTimeFromNow: a => dayjs(a).fromNow(),

  ifCon: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
