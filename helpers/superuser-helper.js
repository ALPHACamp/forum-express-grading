const superuser = require('../superuser.json')

module.exports = {
  isSuperuser: email => email === superuser.email
}
