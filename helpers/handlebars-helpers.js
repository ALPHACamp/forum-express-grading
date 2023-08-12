const dayjs = require('dayjs') // 載入 dayjs 套件
module.exports = {
  currentYear: () => dayjs().year(), // 加逗號
  // 新增以下
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
