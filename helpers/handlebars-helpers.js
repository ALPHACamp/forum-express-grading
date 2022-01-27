const dayjs = require('dayjs')
const currentYear = () => dayjs().year()
const role = isAdmin => isAdmin ? 'admin' : 'user'
const setRole = isAdmin => isAdmin ? 'set user' : 'set admin'
module.exports = {
  currentYear,
  role,
  setRole
}
