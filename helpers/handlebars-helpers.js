const day = require('dayjs')
module.exports = {
  currentYear: () => day().year(),
  role: isAdmin => {
    if (isAdmin) {
      return 'admin'
    }
    return 'user'
  },
  setOption: isAdmin => {
    if (!isAdmin) {
      return 'admin'
    }
    return 'user'
  },
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
