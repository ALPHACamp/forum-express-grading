const dayjs = require('dayjs')
const { isSuperuser } = require('./superuser-helper')

module.exports = {
  fixRoleSetting: email => isSuperuser(email) ? 'disabled' : null,
  currentYear: () => dayjs().year(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
