const dayjs = require('dayjs')
module.exports = {
  currentYear: () => dayjs().year(),
  ifCond: function (a, b, option) {
    return a === b ? option.fn(this) : option.inverse(this)
  }
}
