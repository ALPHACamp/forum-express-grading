const dayjs = require('dayjs') // 載入 dayjs 套件
const relativeTime = require('dayjs/plugin/relativeTime') // 傳入現在時間參數
dayjs.extend(relativeTime) // 把以前的時間拿去把較

module.exports = {
  currentYear: () => dayjs().year(), // 取得當年年份作為 currentYear 的屬性值，並導出
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  autoIncrement: function (i) {
    i++
    return i
  },
  inc: function (value, options) {
    return parseInt(value) + 1
  }
}
