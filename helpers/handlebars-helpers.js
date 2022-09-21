const dayjs = require('dayjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

module.exports = {
  currentYear: () => dayjs().year(),
  isSuperuser: (email, options) => {
    return email === process.env.SUPERUSER_EMAIL ? options.fn(this) : options.inverse(this)
  },
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
