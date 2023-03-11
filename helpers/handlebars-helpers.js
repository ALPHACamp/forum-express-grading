const dayjs = require('dayjs') //載入 dayjs 套件
module.exports = {
  currentYear: () => dayjs().year(), //取得當年年份作為 currentYear 的屬性值，並導出
  ifCond: function (a, b, options) { //這邊刻意不用箭頭函示，如果不用的話，this會指到預期外的值
    return a === b ? options.fn(this) : options.inverse(this)
  }
}