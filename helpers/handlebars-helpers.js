const dayjs = require('dayjs') // 載入 dayjs 套件

module.exports = {
  currentYear: () => dayjs().year(), // 取得當年年份作為 currentYear 的屬性值，並導出
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  } // 有this時，若用箭頭函式 ，會引用到引用情境的外層，而造成錯誤，所以用一般的function將其包住，確保只在hbs中使用
}
