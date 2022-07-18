const dayjs = require('dayjs') // 載入 dayjs 套件
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
module.exports = {
  // 取得當年年份作為 currentYear 的屬性值，並導出
  currentYear: () => dayjs().year(),
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  checkAdmin: function (isAdmin) {
    return isAdmin === 1 ? 'user' : 'admin'
  },
  checkAdminNow: function (isAdmin) {
    return isAdmin === 1 ? 'admin' : 'user'
  },
  // handlebar 判斷相等方式
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
