const dayjs = require('dayjs') // 載入 dayjs 套件
module.exports = {
  // 取得當年年份作為 currentYear 的屬性值，並導出
  currentYear: () => dayjs().year(),

  // 比較兩輸入值是否一致
  ifCond: function (a, b, options) {
    console.log(a, b)
    if (String(a) === String(b)) {
      return options.fn()
    }
    return options.inverse()
  }
}
