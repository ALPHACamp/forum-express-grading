

const dayjs = require('dayjs')
const { isSuperuser } = require('./superuser-helper')

const relativeTime = require('dayjs/plugin/relativeTime')

dayjs.extend(relativeTime)

module.exports = {
  currentYear: () => dayjs().year(),
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  fixRoleSetting: email => isSuperuser(email) ? 'disabled' : null,
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}