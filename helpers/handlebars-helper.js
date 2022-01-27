const dayjs = require('dayjs')

const currentYear = () => {
  return dayjs().year()
}

exports = module.exports = {
  currentYear
}
