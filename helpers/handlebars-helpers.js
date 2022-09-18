const dayjs = require('dayjs')
module.exports = {
  currentYear: () => dayjs().year(),
  isEqual: (a, b, options) => {
    if (a === b) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  }
}
