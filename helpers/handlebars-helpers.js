const day = require('dayjs')

module.exports = {
  currentYear: () => day().year(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
