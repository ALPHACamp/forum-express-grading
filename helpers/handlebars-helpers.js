const dayjs = require('dayjs')
const { isSuperUser } = require('./users-helper')
module.exports = {
  currentYear: () => dayjs().year(),
  disabledRoot: function (user, options) {
    return isSuperUser(user) ? options.fn(this) : options.inverse(this)
  },
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
