const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const currentYear = () => {
  return dayjs().year()
}

const relativeTimeFromNow = a => dayjs(a).fromNow()

function ifCond (a, b, options) {
  // console.log('a:', a, 'b:', b)
  return a === b ? options.fn(this) : options.inverse(this)
}
module.exports = {
  currentYear,
  ifCond,
  relativeTimeFromNow
}
