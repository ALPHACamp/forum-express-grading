const dayjs = require('dayjs')
module.exports = {
  currentYear: dayjs().year(), // 目前日期的總數字.只要年並轉成易讀型 dayjs() === new date() //不會用到 this 所以可以使用 ES6 (=>)

  // 這邊是故意不使用箭頭函式
  // 這邊如果用 this 是對應 ( 綁定 ) 這支檔案，因為是 hbs 語境的關係。
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this) // true or false ? 執行 if : 執行 else
  }
}
