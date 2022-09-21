const dayjs = require('dayjs')
module.exports = {
  currentYear: dayjs().year(), // 目前日期的總數字.只要年並轉成易讀型 dayjs() === new date()
  ifCond: function (a, b, options) { // 這邊是故意不使用箭頭函式
    return a === b ? options.fn(this) : options.inverse(this) // true or false ? 執行 if : 執行 else
  }
}
