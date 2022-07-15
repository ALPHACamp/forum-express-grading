const dayjs = require('dayjs')
module.exports = {
  currentYear: () => dayjs().year(),
  ifIAmSuper: function (userId, deleteId, options) {
    if (Number(userId) === Number(deleteId)) {
      return options.fn()
    }
    return options.inverse()
  },
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
