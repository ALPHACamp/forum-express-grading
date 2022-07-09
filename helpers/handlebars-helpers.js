const dayjs = require('dayjs')
module.exports = {
  currentYear () { return dayjs().year() }
}
