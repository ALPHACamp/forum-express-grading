const dayjs = require('dayjs')

module.exports = {
  currentYear: () => dayjs().year(),
  ifCond: function (a, b, options) {
    // console.log(this)
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
