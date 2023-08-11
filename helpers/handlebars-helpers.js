const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const currentYear = () => {
  return dayjs().year()
}

const relativeTimeFromNow = time => {
  return dayjs(time).fromNow()
}

const countElement = array => {
  return array.length
}

const ifCond = function (a, b, options) { // 不要用箭頭，箭頭的this在function建立時就定下來了
  if (a === b) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
}
module.exports = { currentYear, relativeTimeFromNow, countElement, ifCond }
