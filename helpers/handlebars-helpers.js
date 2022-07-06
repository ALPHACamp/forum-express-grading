const dayjs = require('dayjs')

module.exports = {
  currentYear: () => dayjs().year(),
  isMatch: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
