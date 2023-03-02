const dayjs = require('dayjs')
module.exports = {
  currentYear: () => dayjs().year(),
  // 這裡不使用箭頭函式的原因是因為 this 不會指向箭頭函式之內
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
