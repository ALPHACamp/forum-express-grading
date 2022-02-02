const dayjs = require('dayjs')
const currentYear = () => dayjs().year()
const ifCond = function (a, b, options) {
  return a === b ? options.fn(this) : options.inverse(this)
}
module.exports = {
  currentYear,
  ifCond
}
