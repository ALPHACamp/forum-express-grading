const dayjs = require('dayjs')
// const handlebars = require('express-handlebars')

module.exports = {
  currentYear: () => dayjs().year(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
