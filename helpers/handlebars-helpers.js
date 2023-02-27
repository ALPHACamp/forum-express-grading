const datejs = require('dayjs')
module.exports = {
  currentYear: () => datejs().year(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
