const dayjs = require('dayjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

module.exports = {
  currentYear: () => dayjs().year(),
  isSuperuser: (email, options) => {
    if (email === process.env.SUPERUSER_EMAIL) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  }
}
