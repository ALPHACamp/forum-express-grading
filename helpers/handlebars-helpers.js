const dayjs = require('dayjs')

module.exports = {
  currentYear: () => dayjs().year(),
  ifCond: function (a, b, options) {
    // 若 a 和 b 相等，會回傳 options.fn(this)，不相等則回傳 options.inverse(this)
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
