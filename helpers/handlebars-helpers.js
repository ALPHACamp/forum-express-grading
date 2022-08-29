const dayjs = require('dayjs')
module.exports = {
  // 取得當年年份作為currentYear屬性值，並導出
  currentYear: () => dayjs().year(),
  // 因為在function裡面會用到this，所以不能用箭頭韓式，否則this的對象會有錯誤
  ifCond: function(a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
