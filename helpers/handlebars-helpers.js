const day = require('dayjs')
module.exports = {
  currentYear: () => day().year(),
  role: isAdmin => {
    if (isAdmin) {
      return 'admin'
    }
    return 'user'
  },
  setOption: isAdmin => {
    if (!isAdmin) {
      return 'admin'
    }
    return 'user'
  }
}
