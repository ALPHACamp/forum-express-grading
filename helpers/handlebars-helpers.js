const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const currentYear = () => dayjs().year()
// 取得當年年份作為 currentYear 的屬性值，並導出

const ifCond = (a, b, options) => {
  return a === b ? options.fn(this) : options.inverse(this)
}

module.exports = {
  currentYear,
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  ifCond
}
