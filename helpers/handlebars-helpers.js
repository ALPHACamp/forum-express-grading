const dayjs = require('dayjs')

module.exports = {
  currentYear: () => dayjs().year(),
  isRoot: email => (email === 'root@example.com') ? 'disabled' : null,
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
