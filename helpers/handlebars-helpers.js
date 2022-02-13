const dayjs = require('dayjs')
// 取得當年年份作為 currentYear 的屬性值，並導出
module.exports = {
  currentYear: () => dayjs().year()
}
