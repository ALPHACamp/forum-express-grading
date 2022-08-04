const dayjs = require('dayjs') // 載入 dayjs 套件

module.exports = {
  currentYear: () => dayjs().year()
}
