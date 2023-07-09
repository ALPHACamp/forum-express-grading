const dayjs = require('dayjs') // 載入 dayjs 套件
const relativeTime = require('dayjs/plugin/relativeTime') // 增加這裡
dayjs.extend(relativeTime) // 增加這裡
module.exports = {
  currentYear: () => dayjs().year(), // 取得當年年份作為 currentYear 的屬性值，並導出
  //把絕對時間轉換成相對描述
  relativeTimeFromNow: a => dayjs(a).fromNow(), // 增加這裡
  // 新增以下 if 條件式 (if condition)，把新的 help 命名為 ifCond
  ifCond: function (a, b, options) {
    // 用了三元運算子來簡化 if/else 流程
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
