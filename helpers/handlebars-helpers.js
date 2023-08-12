const dayjs = require('dayjs')

const relativeTime = require('dayjs/plugin/relativeTime') // dayjs 的附加功能(plugin)
dayjs.extend(relativeTime)

module.exports = {
  currentYear: () => dayjs().year(),

  relativeTimeFromNow: a => dayjs(a).fromNow(), // fromNow()：從現在到 a (時間)的相對時間

  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
