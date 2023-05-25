// 樣板引擎裡的邏輯工具
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime') // 增加這裡
dayjs.extend(relativeTime) // 增加這裡

module.exports = {
  currentYear: () => dayjs().year(), // 取得當年年份作為 currentYear 的屬性值，並導出
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
