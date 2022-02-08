// 引入模組
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')

// 增加使用dayjs的relativeTime功能
dayjs.extend(relativeTime)

// 匯出模組
module.exports = {
  currentYear: () => dayjs().year(), // 取得當年年份作為currentYear的屬性值，並導出

  relativeTimeFromNow: a => dayjs(a).fromNow(), // 計算create_At的相對時間描述

  ifCond: function (a, b, options) {
    // a === b時回傳fn(this)， 不相等則回傳inverse(this)
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
