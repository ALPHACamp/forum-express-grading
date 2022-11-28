const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
const { isSuperUser } = require('./users-helper')
dayjs.extend(relativeTime)
module.exports = {
  currentYear: () => dayjs().year(),
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  disabledRoot: function (user, options) {
    return isSuperUser(user) ? options.fn(this) : options.inverse(this)
  },
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
