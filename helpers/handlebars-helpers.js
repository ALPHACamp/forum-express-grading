const dayjs = require('dayjs')
module.exports = {
  // 取得當年年份作為currentYear屬性值，並導出
  currentYear: () => dayjs().year()
}
