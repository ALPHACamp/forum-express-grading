const dayjs = require('dayjs')
module.exports = {
  currentYear: () => dayjs().year(),
  ifIAmSuper: function (userId, deleteId, options) {
    if (Number(userId) === Number(deleteId)) {
      return options.fn()
    }
    return options.inverse()
  }
}
