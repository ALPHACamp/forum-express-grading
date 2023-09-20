const dayjs = require('dayjs') // invoke dayjs
module.exports = {
  currentYear: () => dayjs().year(), // get current year and export
  ifEq: function (a, b, option) {
    return a === b ? option.fn(this) : option.inverse(this)
  }
}
