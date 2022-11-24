const dayjs = require('dayjs')
const { isSuperUser } = require('./users-helper')
module.exports = {
  currentYear: () => dayjs().year(),
  disabledRoot: (user, options) =>
    isSuperUser(user) ? options.fn(this) : options.inverse(this)
}
