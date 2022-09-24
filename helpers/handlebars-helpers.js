const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime') // 增加這裡
dayjs.extend(relativeTime)

exports.currentYear = () => dayjs().year()

exports.isEq = function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
}

exports.relativeTimeFromNow = a => dayjs(a).fromNow()
