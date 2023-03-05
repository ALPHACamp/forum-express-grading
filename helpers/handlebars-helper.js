const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

module.exports = {
  currentYear: () => dayjs().year(),
  relativeTimeFromNow: time => dayjs(time).fromNow(),
  isSame: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
