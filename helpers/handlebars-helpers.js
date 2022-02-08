const dayjs = require('dayjs')
const moment = require('moment')

module.exports = {
  currentYear: () => dayjs().year(),

  moment: a => moment(a).fromNow(),

  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },

  orCond: function (a, b, options) {
    if (a === undefined && b) return options.fn(this)
    if (a) return options.fn(this)
  },

  thisOrThat: (a, b) => a || b
}
