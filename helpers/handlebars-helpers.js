const dayjs = require('dayjs') // 載入 dayjs 套件

// 使用 dayjs 中的 relativeTime 功能
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

module.exports = {
  currentYear: () => dayjs().year(), // 取得當年年份作為 currentYear 的屬性值，並導出

  // for category list
  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  },

  // for relative time
  relativeTimeFromNow: a => dayjs(a).fromNow()
}
