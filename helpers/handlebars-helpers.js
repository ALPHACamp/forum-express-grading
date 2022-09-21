const dayjs = require('dayjs')

const currentYear = () => {
  return dayjs().year()
}
function ifCond (a, b, options) {
  // console.log('a:', a, 'b:', b)
  return a === b ? options.fn(this) : options.inverse(this)
}
module.exports = {
  currentYear,
  ifCond
}
