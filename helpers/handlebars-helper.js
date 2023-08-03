const dayjs = require('dayjs')

module.exports = {
  currentYear: () => dayjs().year(),
  // 注意這邊不能用箭頭函式，因使用this會有問題
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}