const dayjs = require('dayjs')
module.exports = {
  currentYear: () => dayjs().year(),
  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    }
  }
}
