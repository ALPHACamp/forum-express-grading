const dayjs = require('dayjs')
const moment = require('moment')

module.exports = {
  currentYear: () => dayjs().year(),
  showRole: admin => {
    if (admin) {
      return 'admin'
    } else {
      return 'users'
    }
  },
  setRole: admin => {
    if (admin) {
      return 'set as users'
    } else {
      return 'set ad admin'
    }
  },
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  moment: function (a) {
    return moment(a).fromNow()
  }
}
