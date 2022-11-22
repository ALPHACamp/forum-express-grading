const dayjs = require('dayjs')
const { isSuperuser } = require('./superuser-helper')

module.exports = {
  currentYear: () => dayjs().year(),
  fixRoleSetting: email => isSuperuser(email) ? 'disabled' : null,
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
