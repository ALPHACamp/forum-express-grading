const dayjs = require('dayjs') // invoke dayjs
module.exports = {
  currentYear: () => dayjs().year() // get current year and export
}
