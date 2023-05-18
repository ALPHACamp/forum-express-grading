const dayjs = require('dayjs')
module.exports = {
  currentYear: () => dayjs().year() // 取得當年年份作為 currentYear 的屬性值，並導出
}
