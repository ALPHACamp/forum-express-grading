const dayjs = require('dayjs')
module.exports = {
  currentYear: () => dayjs().year() // 取得當年年份作為currentYear的屬性值，並導出
}
