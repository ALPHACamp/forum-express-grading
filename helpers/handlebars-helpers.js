
const dayjs = require('dayjs')
const currentYear = () => {
  return dayjs().year()
}

module.exports = { currentYear }
