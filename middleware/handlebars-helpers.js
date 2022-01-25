const dayjs = require('dayjs')

module.exports = {
  currentYear: () => {
    return dayjs().year()
  },

  ifCon: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
