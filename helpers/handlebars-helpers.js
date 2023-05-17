const dayjs = require('dayjs')

// 註冊helpers時，後面接的是物件，因此直接匯出物件{}
module.exports = {
  currentYear: () => dayjs().year(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
