const dayjs = require('dayjs') // 載入 dayjs 套件
module.exports = {
  currentYear: () => dayjs().year(), // 取得當年年份作為 currentYear

  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
