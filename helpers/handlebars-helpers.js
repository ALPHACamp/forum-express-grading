const dayjs = require('dayjs')

module.exports = {
  currentYear: () => dayjs().year(),
  formateRole: (number) => {
    if (number === 1) {
      return 'Admin'
    } else {
      return 'User'
    }
  }
}
