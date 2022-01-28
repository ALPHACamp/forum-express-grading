const dayjs = require('dayjs')
const moment = require('moment')

module.exports = {
  currentYear: () => dayjs().year(),

  moment: a => moment(a).fromNow(),

  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
