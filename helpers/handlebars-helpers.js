const dayjs = require('dayjs')

const currentYear = () => dayjs().year() // 取得當年年分
const isAdmin = (value, options) => {
  return value === 1 ? options.fn(this) : options.inverse(this)
}
module.exports = {
  currentYear,
  isAdmin
}
