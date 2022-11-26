const dayjs = require('dayjs') // 載入 dayjs 套件
module.exports = {
  currentYear: () => dayjs().year(), // 取得當年年份作為 currentYear 的屬性值，並導出

  ifCond: function (a, b, options) { // 讓handlebars的if能做判斷
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
