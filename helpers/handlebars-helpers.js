const dayjs = require('dayjs')
const currentYear = () => dayjs().year()
const isAdminLogger = (thisIsAdim, thisId, userId, options) => {
  if (thisIsAdim && thisId === userId) {
    return options.fn(this)
  }
}
module.exports = {
  currentYear,
  isAdminLogger
}
