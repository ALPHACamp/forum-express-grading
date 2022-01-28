const dayjs = require('dayjs')
const moment = require('moment')
module.exports = {
  currentYear: () => dayjs().year(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  moment: function (a) {
    return moment(a).fromNow()
  },
  sum: function (a) {
    return a.length
  }
}
