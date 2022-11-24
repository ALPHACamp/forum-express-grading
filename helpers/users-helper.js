const { superUsers } = require('../models/superuser.json')
module.exports = {
  isSuperUser: user => {
    return (user.name === superUsers.name && user.email === superUsers.email)
  }
}
