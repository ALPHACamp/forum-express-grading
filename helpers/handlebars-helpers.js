const dayjs = require('dayjs')

module.exports = {
  currentYear: () => dayjs().year(),
  formateRole: function (number) {
    if (number === 1) {
      return 'Admin'
    } else {
      return 'User'
    }
  },
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
