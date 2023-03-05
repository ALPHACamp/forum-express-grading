const dayjs = require('dayjs')
module.exports = {
  currentYear: () => dayjs().year(),
  role: isAdmin => {
    if (isAdmin) return 'admin'
    return 'user'
  },
  roleToBe: isAdmin => {
    if (!isAdmin) return 'admin'
    return 'user'
  }
}
