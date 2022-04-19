const dayjs = require('dayjs')
module.exports = {
  currentYear: () => dayjs().year(),
  ifCond: function (a, b, options) {
    // 注意如果有用到 this 的話，切記要用 function 不能用 arrow function ！！！
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
