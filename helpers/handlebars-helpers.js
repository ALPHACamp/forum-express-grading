const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const superuserEmail = process.env.SUPERUSER_EMAIL || 'root@example.com'

module.exports = {
  currentYear: () => dayjs().year(),
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  isSuperuser: (email, options) => {
    return email === superuserEmail ? options.fn(this) : options.inverse(this)
  },
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
