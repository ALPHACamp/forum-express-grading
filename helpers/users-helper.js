const { superUsers } = require('../models/superuser.json')
module.exports = {
  isSuperUser: user => {
    return user.email === superUsers.email
  }
}
