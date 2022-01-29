const dayjs = require('dayjs')
module.exports = {
  currentYear: () => {
    return dayjs().year()
  },
  if_isMatch: (a, b, options) => {
    if (a === b) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  }
}
