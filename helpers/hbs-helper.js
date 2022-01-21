const dayjs = require('dayjs')

module.exports = {
  currentYear: () => dayjs().year(),
  showRole: admin => {
    if (admin) {
      return 'admin'
    } else {
      return 'users'
    }
  },
  setRole: admin => {
    if (admin) {
      return 'set as users'
    } else {
      return 'set ad admin'
    }
  }
}
